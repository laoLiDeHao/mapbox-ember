import mapboxgl from "mapbox-gl";
import "./structures";
import { DrawCalculate } from "./components/DrawCalculate";
import EventManage from "./components/EventManage";
import Logger from "./components/Logger";
import GeojsonManage from "./components/GeojsonManage";
// type Mp = typeof mapboxgl.Map; //避免与Map冲突

import Language from "./components/Language";
import Marks from "./components/Marks";
import Navigations from "./components/Navigations";
import { Conf } from "./structures";
export default class Emberbox {
  map: any = null;
  language: Language;
  logger: Logger; // 控制台输出
  eventManage: EventManage; //   使用统一Msg传输数据
  drawCalculate: DrawCalculate | null = null;
  geojsonManage: GeojsonManage | null = null;
  marks: Marks | null;
  conf: Conf | null = null;
  navigations: Navigations;

  constructor(
    id: string,
    token: string,
    conf: Conf = {
      // center: [108.948024, 34.263161],
      center: {
        lng: 108.948024,
        lat: 34.263161,
      },
      zoom: 12,
    }
  ) {
    mapboxgl.accessToken = token; //token
    //天地图的token
    const tiandituToken = "8acb29ef58c13027ae10a4b79116bce4";
    /*
     * 天地图提供了多种背景地图和标注供选择，
     * 只要从http://lbs.tianditu.gov.cn/server/MapService.html找到对应的url即可
     * 这里使用了了矢量地图和注记
     * */
    //矢量底图
    const vecwUrl =
      "https://t0.tianditu.gov.cn/vec_w/wmts?" +
      "SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&" +
      "TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=" +
      tiandituToken;
    //矢量注记
    const cvawUrl =
      "https://t3.tianditu.gov.cn/cva_w/wmts?" +
      "SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&" +
      "TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=" +
      tiandituToken;
    function addRasterTileLayer(
      map: any,
      url: any,
      sourceId: any,
      layerId: any
    ) {
      map.addSource(sourceId, {
        type: "raster",
        tiles: [url],
        tileSize: 256,
      });
      map.addLayer({
        id: layerId,
        type: "raster",
        source: sourceId,
      });
    }

    mapboxgl.setRTLTextPlugin(
      "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
      (err) => err && alert(err)
    ); //language extend plugin

    const logger = new Logger();
    const eventManage = new EventManage(logger);
    const map = new mapboxgl.Map({
      container: id, // container ID
      projection: { name: "globe" },
      // style: "mapbox://styles/embereeee/cllozqed2004201pef3b8atmz",//mapbox://styles/mapbox/streets-v12
      style: "mapbox://styles/mapbox/streets-v12",
      center: conf.center,
      zoom: conf.zoom,
    });
    const language = new Language(map);
    const drawCalculate = new DrawCalculate(map, eventManage);
    const geojsonManage = new GeojsonManage(map, logger, eventManage);
    const marks = new Marks(map, logger, eventManage);
    const navigations = new Navigations(map, marks, logger, eventManage);
    // eventManage.call("asda"); //测试用
    map.on("load", () => {
      addRasterTileLayer(map, vecwUrl, "vecw", "vecw");
      addRasterTileLayer(map, cvawUrl, "cvaw", "cvaw");
      map.on("click", this.click);
      map.on("mousemove", this.mousemove);
      map.on("zoom", (e: any) => {
        eventManage.call("onZoom", map.getZoom());

        return e;
      });
    });

    this.conf = conf;
    this.logger = logger;
    this.eventManage = eventManage;
    this.map = map;
    this.language = language;
    this.drawCalculate = drawCalculate;
    this.geojsonManage = geojsonManage;
    this.navigations = navigations;
    this.marks = marks;
  }

  on = (event: string, handler: any) => {
    this.eventManage.set(event, handler);
  };

  // 获取this
  click = (e: any) => {
    if (this.drawCalculate !== null) this.drawCalculate.handleClick(e);
  };
  mousemove = (e: any) => {
    if (this.drawCalculate !== null) this.drawCalculate.handleMousemove(e);
  };

  // 全局事件
  reset = (ncf: Conf = {}) => {
    let { map, conf } = this;
    if (ncf) Object.assign(conf as Conf, ncf);
    if (map === null) return;
    map.flyTo({
      speed: 2,
      ...conf,
    });
  };
  // zoom
  zoomIn = () => {
    let { map } = this;
    if (map === null) return;

    map.setZoom(map.getZoom() + 1);
  };
  zoomOut = () => {
    let { map } = this;
    if (map === null) return;
    map.setZoom(map.getZoom() - 1);
  };
}
