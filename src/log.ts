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
      name: string,
      ...value: any[]
    )

    logLevel(id: EventIdType, level: string)
  }
}

export class Log {
  private defaultLevel: string
  private eventLevels: Record<string, string>
  private levelEmojis: object
  private levelSpaces: object
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
    e.emit.logEvent(e.id, level, e.name, ...value)
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
    e.emit.logEvent(e.id, level, e.name, ...value)
  }

  public logEvent(
    e: EventType,
    level: string,
    name: string,
    ...value: any[]
  ): void {
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
      `${name}(${e.id.join(", ")})`,
      ...value
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
}

export function log(emit: Emit): void {
  const log = new Log()
  emit.any(null, log.logAny.bind(log))
  emit.any("log", log.log.bind(log))
  emit.any("logEvent", log.logEvent.bind(log))
  emit.any("logLevel", log.logLevel.bind(log))
}
