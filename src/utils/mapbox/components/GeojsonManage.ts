import { loadJson } from "./Loaders";
import Logger from "./Logger";
import EventManage from "./EventManage";
import { UUID } from "uuidjs";

export default class GeojsonManage {
  map: any | null = null; //避免与Map冲突
  logger: Logger;
  eventManage: EventManage;
  jsonArray: {
    source: string;
    current: string | number | null;
    handleMousemove: any;
    handleMouseleave: any;
  }[] = [];
  urlList: string[] = [];
  last: any = null; //记录鼠标最后停留的json数据
  constructor(map: any, logger: Logger, eventManage: EventManage) {
    this.logger = logger;
    this.eventManage = eventManage;
    this.map = map;
    map.on("load", () => {});
  }
  /**
   *
   * @param json 数据
   * @param hover 是否hover透明度变化
   * @returns
   */
  addJson = (json: any, hover: boolean = true) => {
    console.log("addJson", this.map);

    if (this.map === null) return;
    let map = this.map;
    // const uuid = UUID.generate();
    // console.log("uuid0", uuid);
    let source = UUID.generate();
    // let source = self.crypto.randomUUID();
    json.features.forEach((item: any, index: number) => {
      item.id = index;
    });
    console.log(map.addSource);

    map.addSource(source, {
      type: "geojson",
      data: json,
    });
    console.log("paint fills");

    // map.addLayer({
    //   id: `${source}-fills`,
    //   type: "fill-extrusion",
    //   source: source,
    //   layout: {},
    //   // "fill-color": "#627BC1",
    //   paint: {
    //     "fill-extrusion-color": ["coalesce", ["get", "color"], "#627BC1"],

    //     "fill-extrusion-height": ["coalesce", ["get", "height"], 1],

    //     // Get `fill-extrusion-base` from the source `base_height` property.
    //     "fill-extrusion-base": ["coalesce", ["get", "base"], 1],
    //     // "fill-extrusion-opacity": [
    //     //   "case",
    //     //   ["boolean", ["feature-state", "hover"], false],
    //     //   1,
    //     //   0.5,
    //     // ],
    //     "fill-extrusion-opacity": [
    //       "case",
    //       ["boolean", ["feature-state", "hover"], false],
    //       1,
    //       0.5,
    //     ],
    //   },
    // });

    map.addLayer({
      id: `${source}-fills`,
      type: "fill",
      source: source,
      layout: {},
      // "fill-color": "#627BC1",
      paint: {
        "fill-color": ["coalesce", ["get", "fill-color"], "#627BC1"],

        "fill-opacity": hover
          ? ["case", ["boolean", ["feature-state", "hover"], false], 1, 0.5]
          : 1,
      },
    });

    map.addLayer({
      id: `${source}-borders`,
      type: "line",
      source: source,
      layout: {},
      paint: {
        // "line-color": "#627BC1",
        "line-color": ["coalesce", ["get", "line-color"], "#ffffff"],
        "line-width": ["coalesce", ["get", "line-width"], 5],
        // "line-extrusion-height": 100,
      },
    });
    // add event and mark data
    let curJson = {
      source: source,
      current: null,
      handleMousemove: null,
      handleMouseleave: null,
    };

    // 事件处理函数
    const handleMousemove = (e: any) => {
      if (e.features.length > 0) {
        // hoverEvent
        this.eventManage.call("onGeoJsonMouseon", e.features[0]);
        // hoveredPolygonId

        if (curJson.current !== null) {
          map.setFeatureState(
            { source: source, id: curJson.current },
            { hover: false }
          );
        }
        if (curJson.current != e.features[0].id) {
          curJson.current = e.features[0].id;
          this.last = e.features[0];
          this.eventManage.call("onGeoJsonMouseenter", e.features[0]);
        }

        map.setFeatureState(
          { source: source, id: curJson.current },
          { hover: true }
        );
      }
    };
    const handleMouseleave = () => {
      if (curJson.current !== null) {
        map.setFeatureState(
          { source: source, id: curJson.current },
          { hover: false }
        );
      }
      curJson.current = null;
      this.eventManage.call("onGeoJsonMouseleave", this.last);
    };

    // mousein and state-fills hover true
    map.on("mousemove", `${source}-fills`, handleMousemove);
    // When the mouse leaves the state-fill layer, update the feature state of the
    // previously hovered feature.
    map.on("mouseleave", `${source}-fills`, handleMouseleave);

    Object.assign(curJson, { handleMouseleave, handleMousemove });
    console.log(curJson, this);

    this.jsonArray.push(curJson);

    return source;
  };
  addIndoorJson(json: any) {
    if (this.map === null) return;
    let map = this.map;
    // const uuid = UUID.generate();
    // console.log("uuid0", uuid);
    // let source = self.crypto.randomUUID();
    let source = UUID.generate();

    json.features.forEach((item: any, index: number) => {
      item.id = source + index;
    });

    map.addSource(source, {
      type: "geojson",
      data: json,
    });
    console.log("paint fills");

    map.addLayer({
      id: `${source}-fills-indoor`,
      type: "fill-extrusion",
      source: source,
      layout: {},
      // "fill-color": "#627BC1",
      paint: {
        "fill-extrusion-color": ["coalesce", ["get", "color"], "#627BC1"],

        "fill-extrusion-height": ["coalesce", ["get", "height"], 1],

        // Get `fill-extrusion-base` from the source `base_height` property.
        "fill-extrusion-base": ["coalesce", ["get", "base"], 1],

        "fill-extrusion-opacity": 0.5,
      },
    });

    // add event and mark data
    let curJson = {
      source: source,
      current: null,
      handleMousemove: null,
      handleMouseleave: null,
    };

    // 事件处理函数
    const handleMousemove = (e: any) => {
      if (e.features.length > 0) {
        // hoverEvent
        this.eventManage.call("onGeoJsonMouseon", e.features[0]);
        // hoveredPolygonId

        if (curJson.current != e.features[0].id) {
          curJson.current = e.features[0].id;
          this.last = e.features[0];
          this.eventManage.call("onGeoJsonMouseenter", e.features[0]);
        }
      }
    };
    const handleMouseleave = (e: any) => {
      console.log(e);

      curJson.current = null;
      this.eventManage.call("onGeoJsonMouseleave", this.last);
    };
    // mousein and state-fills hover true
    map.on("mousemove", `${source}-fills-indoor`, handleMousemove);
    // When the mouse leaves the state-fill layer, update the feature state of the
    // previously hovered feature.
    map.on("mouseleave", `${source}-fills-indoor`, handleMouseleave);

    Object.assign(curJson, { handleMouseleave, handleMousemove });

    this.jsonArray.push(curJson);

    return source;
  }
  addJsonByUrl = async (url: string) => {
    if (this.map === null) return;
    this.checkReload(url);
    let source = await loadJson(url)
      .then((json) => {
        this.cacheUrl(url);

        return this.addJson(json);
      })
      .catch((err) => {
        this.logger.out("201E", err);
      });

    return source;
  };
  addIndoorJsonByUrl = async (url: string) => {
    if (this.map === null) return;
    this.checkReload(url);
    let source = await loadJson(url)
      .then((json) => {
        this.cacheUrl(url);
        return this.addIndoorJson(json);
      })
      .catch((err) => {
        this.logger.out("201E", err);
      });

    return source;
  };

  removeJson = (source: string) => {
    if (this.map === null) return;
    let map = this.map;
    let curJson = this.jsonArray.find((item) => item.source === source);
    if (curJson) {
      // 取消绑定与该图层相关的事件处理程序
      map.off("mousemove", `${source}-fills`, curJson.handleMousemove);
      map.off("mouseleave", `${source}-fills`, curJson.handleMouseleave);
      // map.removeLayer(`${source}-fills`);
      // map.removeLayer(`${source}-borders`);

      this.removelayer(`${source}-fills`);
      this.removelayer(`${source}-fills-indoor`);
      this.removelayer(`${source}-borders`);

      map.removeSource(source);
    }
    this.jsonArray = this.jsonArray.filter((item) => item.source !== source);
    // 移除数据源
  };
  removelayer = (id: string) => {
    if (this.map === null) return;
    let map = this.map;
    if (map.getLayer(id)) {
      // 删除图层
      map.removeLayer(id);
    }
  };

  cacheUrl = (url: string) => {
    this.urlList.push(url);
    if (this.urlList.length > 30) this.urlList.shift();
  };
  checkReload = (url: string) => {
    let isReload = this.urlList.includes(url);
    if (isReload) {
      this.logger.out("201W", { url: url });
    }
  };
}
