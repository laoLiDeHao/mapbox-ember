import mapboxgl from "mapbox-gl";
import Logger from "./Logger";
import EventManage from "./EventManage";
// import { spanline } from "./TestDatas";
import { UUID } from "uuidjs";

export default class Marks {
  map: any;
  logger: Logger | null = null;
  eventManage: EventManage | null = null;
  marks: {
    id: string;
    mark: any;
  }[] = [];
  constructor(map: any, logger: Logger, eventManage: EventManage) {
    // let t = 0.5;
    // setInterval(() => {
    //   t += 0.01;
    //   //   marker1.setRotation(Math.sin(t) * 360);
    //   //   marker1.setLngLat([108.948024 + Math.sin(t) * 0.05, 34.263161]);
    //   //   marker1.setRotation(Math.sin(t) * 360);
    this.map = map;
    this.logger = logger;
    this.eventManage = eventManage;
    // }, 10);
    map.on("load", () => {
      // let id: any = this.addMark([108.948024, 34.263161], {
      //   rotation: 0,
      //   color: null,
      //   url: "/svgs/mark_def.svg",
      //   width: 50,
      //   height: 50,
      // });
      // setTimeout(() => {
      //   this.removeById(id);
      // }, 2000);
      // this.addRoad();
    });
  }
  // url("https://placekitten.com/g/60/60/")
  /**
   * 
   * @param position:[lng,lat] 
   * @param config :{
   *  color?: string | null | undefined; default "#0000aa"; 
      rotation?: number | null | undefined;default 0 ;
      url?: string | null;if has url add custom image;
      width?: number; default 50px;
      height?: number;default 50px;
   * }
   * @returns 
   */
  addMark = (
    position: [number, number],
    config: {
      color?: string | null | undefined;
      rotation?: number | null | undefined;
      url?: string | null;
      width?: number;
      height?: number;
    } = {
      color: "#0000aa",
      rotation: 0,
      width: 50,
      height: 50,
    }
  ) => {
    let { map } = this;
    if (!map) return;
    // let id: string = self.crypto.randomUUID();
    let id: string = UUID.generate();

    let { color, rotation, url, width, height } = config;
    let mark, conf: any;
    if (url) {
      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = `url(${url})`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = "100%";
      el.style.zIndex = "9999";
      conf = el;
    } else {
      conf = { color, rotation };
    }
    mark = new mapboxgl.Marker(conf).setLngLat(position).addTo(this.map);
    let cur = { id, mark };

    this.marks.push(cur);

    return id;
  };
  getAll = () => this.marks;
  getByid = (id: string) => {
    console.log(this.marks.find((item) => item.id === id)?.mark);

    return this.marks.find((item) => item.id === id);
  };
  removeById = (id: string) => {
    let cur = this.getByid(id);
    if (!cur) return;
    cur.mark.remove();
    this.marks = this.marks.filter((item) => item.id !== id);
  };
  remove = (mark: any) => mark.remove();
  // linesys in road
}
