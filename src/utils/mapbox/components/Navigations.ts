import { spanline } from "./TestDatas";
import Marks from "./Marks";
import EventManage from "./EventManage";
import Logger from "./Logger";

export default class Navigations {
  map: any | null = null;
  marks: Marks | null = null;
  logger: Logger | null = null;
  eventManage: EventManage | null = null;

  // 三种路径
  pathSource: any = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [],
        },
      },
    ],
  };
  animateTick: any = null;
  isAnimate: "stop" | "pause" | "play" = "stop";
  pathAnimate: any = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [],
        },
      },
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [],
        },
      },
    ],
  };
  path: any = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [],
        },
      },
    ],
  };

  //   播放路径的参数

  featureIndex = 0;
  counterIndex = 0;
  ticksIndex = 0;

  constructor(
    map: any,
    marks: Marks,
    logger: Logger,
    eventManage: EventManage
  ) {
    this.marks = marks;
    map.on("load", () => {
      // 当前导航数据
      map.addSource("pathSource", {
        type: "geojson",
        data: this.pathSource,
        lineMetrics: true,
      });
      map.addLayer({
        id: "pathSourceLine",
        type: "line",
        source: "pathSource",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-width": 4,
          "line-color": "#673ab7",
        },
      });
      //  动画演示用数据
      map.addSource("pathSourceAnimate", {
        type: "geojson",
        data: this.pathAnimate,
        lineMetrics: true,
      });
      map.addLayer({
        id: "pathAnimateLine",
        type: "line",
        source: "pathSourceAnimate",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-width": 5,
          "line-color": "green",
        },
      });
      // 当前已完成的路径
      map.addSource("path", {
        type: "geojson",
        data: this.path,
        lineMetrics: true,
      });
      map.addLayer({
        id: "pathLine",
        type: "line",
        source: "path",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-width": 5,
          "line-color": "blue",
        },
      });

      this.map = map;

      this.setPathSource(spanline);
      // this.playPathSource();
    });
    this.marks = marks;
    this.logger = logger;
    this.eventManage = eventManage;
  }

  setPathSource = (data: any) => {
    let { map } = this;
    if (map === null) return;
    this.pathSource = data;
    map.getSource("pathSource").setData(data);
  };
  setPath(data: any) {
    let { map } = this;
    if (map === null) return;
    this.pathSource = data;
    map.getSource("path").setData(data);
  }

  playPathSource = () => {
    if (this.isAnimate === "stop") {
      this.eventManage?.call("onNavigationReviewStart", null);
    }
    this.isAnimate = "play";
    this.animateTick = setInterval(() => {
      this.pathSourceAinmate();
    }, 200);
  };
  pausePathSource = () => {
    this.isAnimate = "pause";
    this.eventManage?.call("onNavigationReviewPause", null);
    if (this.animateTick) clearInterval(this.animateTick);
  };
  stopPathSource = () => {
    if (this.animateTick) clearInterval(this.animateTick);

    this.pathAnimate = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [],
          },
        },
      ],
    };
    this.featureIndex = 0;
    this.counterIndex = 0;
    this.map.getSource("pathSourceAnimate").setData(this.pathAnimate);
    this.isAnimate = "stop";
    this.ticksIndex = 0;
    this.eventManage?.call("onNavigationReviewEnd", null);
  };
  pathSourceAinmate = () => {
    let { map, pathSource, pathAnimate } = this;
    if (map === null) return;
    if (this.featureIndex >= this.pathSource.features.length) {
      this.pausePathSource();
      return;
    }
    this.ticksIndex++;
    let sourceDatalist =
      pathSource?.features[this.featureIndex].geometry.coordinates;

    this.pathAnimate.features[0].geometry.coordinates.push(
      sourceDatalist[this.counterIndex]
    );
    if (this.ticksIndex % 50 === 0) {
      console.log("geo");

      map.flyTo({
        center: sourceDatalist[this.counterIndex],
        zoom: 14,
        speed: 2,
      });
    }

    map.getSource("pathSourceAnimate").setData(pathAnimate);
    this.eventManage?.call("onNavigationPlaying", pathAnimate);
    this.counterIndex += 1;
    if (this.counterIndex >= sourceDatalist.length) {
      this.featureIndex += 1;
      this.counterIndex = 0;
      sourceDatalist =
        pathSource.features[this.featureIndex]?.geometry.coordinates;
    }
  };
}
