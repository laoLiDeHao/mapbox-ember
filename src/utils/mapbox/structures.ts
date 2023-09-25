// import { type } from "os";

// events 回调的统一消息体
export interface Msg {
  name: string;
  code: boolean;
  data: { [key: string]: any };
}
// Logger输出code与消息格式
export interface LoggerData {
  code: string;
  message: string;
  type: "Log" | "Warn" | "Error";
}
export interface Conf {
  center?:{
    lng: number;
    lat: number;
  };
  zoom?: number;
}
