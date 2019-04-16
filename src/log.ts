import { Emit, EventIdType, EventType } from "@emit-js/emit"

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
  }
}

export class Log {
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

    this.levels = ["debug", "trace", "info", "warn", "error"]
  }

  public log(
    e: EventType,
    level: string,
    ...value: any[]
  ): void {
    e.emit.logEvent(e.id, level || "debug", e.name, ...value)
  }

  public logEvent(
    e: EventType,
    level: string,
    name: string,
    ...value: any[]
  ): void {
    // eslint-disable-next-line no-console
    console.log(
      this.levelEmojis[level] + this.levelSpaces[level],
      `${name}(${e.id.join(", ")})`,
      ...value
    )
  }
}

export function log(emit: Emit): void {
  const log = new Log()
  emit.any("log", log.log.bind(log))
  emit.any("logEvent", log.logEvent.bind(log))
}
