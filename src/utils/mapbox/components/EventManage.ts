import events from "./Events";
import Logger from "./Logger";
import LoggerConfig from "./LoggerConfig";

export default class EventManage {
  list: { [key: string]: (...args: any[]) => any } = events;
  LoggerConfig: any[] = LoggerConfig;
  logger: Logger;
  constructor(logger: Logger) {
    this.logger = logger;
  }

  set(key: string, fun: (...args: any[]) => any) {
    // console.log("start set", key, fun);

    for (let k in this.list) {
      // console.log("match", {
      //   k,
      //   key,
      // });

      if (k === key) {
        this.list[k] = fun;
        console.log("done", this.list);
        break;
      }
    }
  }

  call(...args: any[]) {
    let key: keyof typeof this.list = args[0];
    let fun = this.list[key];
    args.shift();
    if (fun) return fun(...args);
    // no  event matched
    else this.logger.out("100W", this.list);
  }
}
