import { Emit, EventType } from "@emit-js/emit"

declare module "@emit-js/emit" {
  interface Emit {
    log(
      id: EventIdType,
      level?: string,
      ...value: any
    ): Promise<void>
    
    logEvent(
      id: EventIdType,
      level: string,
      ...value: any[]
    ): void

    logLevel(id: EventIdType, level: string): void
  }
}

export class Log {
  private defaultLevel: string
  private eventLevels: Record<string, string>
  private levelEmojis: Record<string, string>
  private levelSpaces: Record<string, string>
  private levels: string[]

  public constructor() {
    this.levelEmojis = {
      debug: "🐛",
      error: "🛑",
      info: "ℹ️",
      trace: "💻",
      warn: "⚠️",
    }

    this.levelSpaces = {
      debug: "",
      error: "",
      info: " ",
      trace: "",
      warn: " ",
    }

    this.levels = ["trace", "debug", "info", "warn", "error"]

    this.defaultLevel = this.isLevel(process.env.LOG) ? process.env.LOG : "info"
    this.eventLevels = {}
  }

  public log(
    e: EventType,
    level?: string,
    ...value: any[]
  ): void {
    if (e.name === "logEvent") {
      return
    }
    if (!this.isLevel(level)) {
      value.unshift(level)
      level = "debug"
    }
    e.emit.logEvent([e.name, e.id], level, ...value)
  }

  public logAny(
    e: EventType,
    ...value: any[]
  ): void {
    if (e.name === "log" || e.name === "logEvent") {
      return
    }
    const level = this.eventLevels[e.name] ?
      this.eventLevels[e.name] :
      "debug"
    e.emit.logEvent([e.name, e.id], level, ...value)
  }

  public logEvent(
    e: EventType,
    level: string,
    ...value: any[]
  ): void {
    const [ name, ...id ] = e.id
    level = this.isLevel(level) ? level : "info"
    if (
      this.levels.indexOf(level) <
      this.levels.indexOf(this.defaultLevel)
    ) {
      return
    }
    // eslint-disable-next-line no-console
    console.log(
      this.levelEmojis[level] + this.levelSpaces[level],
      `${name}(${id.join(", ")})`,
      ...this.summarize(value)
    )
  }

  public logLevel(e: EventType, level: string): void {
    if (this.isLevel(level)) {
      if (e.id[0]) {
        this.eventLevels[e.id[0]] = level
      } else {
        this.defaultLevel = level
      }
    }
  }

  private isLevel(level: string): boolean {
    return this.levels.indexOf(level) > -1
  }

  private summarize(arr: any[]): string[] {
    return arr.map((v: any): any => {
      const type = typeof v
      if (type === "object" && type !== null) {
        const types = Object.keys(v).map(
          (k: string): string => `${k}: [${typeof v[k]}]`
        )
        return `{ ${types.join(", ")} }`
      } else if (type === "string") {
        return v
      } else {
        return type
      }
    })
  }
}

export function log(emit: Emit): void {
  const log = new Log()
  emit.any(null, log.logAny.bind(log))
  emit.any("log", log.log.bind(log))
  emit.any("logEvent", log.logEvent.bind(log))
  emit.any("logLevel", log.logLevel.bind(log))
}

export const listen = log
