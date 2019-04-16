import { Emit } from "@emit-js/emit"
import { log } from "../"

var emit: Emit

beforeEach((): void => {
  emit = new Emit()
  log(emit)
})

test("log", (): void => {
  emit.log(null, "debug")
  emit.log("p1", "error")
  emit.log(["p1", "p2"], "info", "hi")
  emit.logEvent("test", "trace", "event", "hi")
  emit.log(null, "warn", "hi")
  emit.log("anything")
  emit.log(null)
})
