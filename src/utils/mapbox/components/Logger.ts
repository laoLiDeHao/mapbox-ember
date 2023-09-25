import { LoggerData } from "../structures";
import LoggerConfig from "./LoggerConfig";

export default class Logger {
  constructor() {}

  print(
    type: "log" | "warn" | "error",
    val: string,
    style: string,
    detail: any = {}
  ) {
    console.log(`%c${type}:${val}`, style, detail);
  }

  log(val: string, detail: any = {}) {
    const style = "color: black; background-color: blue;";
    this.print("log", val, style, detail);
  }

  warn(val: string, detail: any = {}) {
    const style = "color: black; background-color: yellow;";
    this.print("log", val, style, detail);
  }
  error(val: string, detail: any = {}) {
    const style = "color: black; background-color: red;";
    this.print("log", val, style, detail);
  }

  out(code: string, detail: any = {}) {
    let data: LoggerData | undefined = LoggerConfig.find(
      (item) => item.code === code
    );
    if (!data) return;
    let { type, message } = data;
    switch (type) {
      case "Log":
        this.log(message, detail);
        break;
      case "Warn":
        this.warn(message, detail);
        break;
      case "Error":
        this.error(message, detail);
        break;
      default:
        break;
    }
  }
}
