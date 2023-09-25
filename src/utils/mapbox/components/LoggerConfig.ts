import { LoggerData } from "../structures";

const LoggerConfig: LoggerData[] = [
  //L:log  W:warn   E:error
  // 000 logger自身
  {
    code: "000",
    type: "Log",
    message: "defaule logger",
  },

  // eventmanage 图层  100

  {
    code: "100L",
    type: "Log",
    message: "Default log info -eventmanage",
  },
  {
    code: "100W",
    type: "Warn",
    message: "invide key of EventManage,check events list",
  },
  {
    code: "100E",
    type: "Error",
    message: "invide key of EventManage,check events list",
  },

  // 2 数据处理GeoJson
  // log
  {
    code: "200L",
    type: "Log",
    message: "Default log info -eventmanage",
  },
  //  warn
  {
    code: "200W",
    type: "Warn",
    message: "Default log info -eventmanage",
  },
  {
    code: "201W",
    type: "Warn",
    message:
      "Carefully, mutiple load same geojson ,it may cause vision error and system shut",
  },
  // error
  {
    code: "200E",
    type: "Error",
    message: "Default log info -eventmanage",
  },
  {
    code: "201E",
    type: "Error",
    message: "Geojson log failed",
  },

  // 3 图形处理
];
export default LoggerConfig;
