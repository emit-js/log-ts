import { Emit } from "@emit-js/emit"
import { log } from "../"

var emit: Emit

beforeEach((): void => {
  emit = new Emit()
  log(emit)
})

test("log", (): void => {
  emit.logLevel(null, "trace")
  emit.log(null, "debug")
  emit.log("p1", "error")
  emit.log(["p1", "p2"], "info", "hi")
  emit.logEvent(["event", "test"], "trace", "hi")
  emit.log(null, "warn", "hi")
  emit.log(null, "anything")
  emit.log(null)
})

test("log any event at log level debug", (): void => {
  emit.logLevel(null, "debug")
  emit.emit(["test", "id"], "log", "any")
})

test("set log level for specific event names", (): void => {
  emit.logLevel("test", "info")
  emit.emit(["test", "id"], "custom", "event", "logLevel")
})
