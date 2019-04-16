# @emit-js/log

emit logger

![log](media/log.gif)

## Install

```bash
npm install @emit-js/emit @emit-js/log
```

## Setup

```js
import { Emit } from "@emit-js/emit"
import { log } from "@emit-js/log"

const emit = new Emit()
log(emit)
```

## Log levels

There are five log levels: `trace`, `debug`, `info`, `warn`, and `error`.

By default, the logger only logs messages at log level `info` or above, but you can change that:

```js
emit.logLevel(null, "debug")
```

You could also set the environment variable `LOG=debug`.

## Logs all events

By default, the logger logs all events at log level `debug`.

Change the log level to `info` for certain events:

```js
emit.logLevel("myEvent", "info")
```

## Manual logging

All of these work:

```js
emit.log(null, "log message at log level info")
emit.log(null, "warn", "warning!")
emit.log(["event", "ids"])
```
