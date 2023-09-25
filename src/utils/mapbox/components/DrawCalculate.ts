// import mapboxgl from "mapbox-gl";
import MapBoxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";
import EventManage from "./EventManage";
type Mp = any; //避免与Map冲突
// type MapBoxDraw = typeof MapBoxDraw;

export class DrawCalculate {
  map: Mp | null = null;
  area: number = 0;
  draw: MapBoxDraw | null = null;
  eventManage: EventManage;

  constructor(map: Mp, eventManage: any) {
    const draw = new MapBoxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        polygon: true,
        trash: true,
      },
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      // defaultMode: "draw_polygon",
      defaultMode: "simple_select",
    });
    map.addControl(draw);
    console.log(draw);

    map.on("draw.create", this.updateArea);
    map.on("draw.delete", this.updateArea);
    map.on("draw.update", this.updateArea);

    // map.on("click", this.handleClick);

    this.draw = draw;
    this.map = map;
    this.eventManage = eventManage;

    this.simple_select();
    // this.
  }

  private updateArea = () => {
    let area = 0;
    const data = this.draw!.getAll();
    console.log(data);

    if (data.features.length > 0) {
      const Area = turf.area(data); //km2
      // const Length = turf.length(data); //km

      // console.log(length);

      // Restrict the area to 2 decimal points.
      area = Math.round(Area * 100) / 100;
      // length = Math.round(Length * 100) / 100;
    }

    this.onAreaChange(area);
  };

  handleClick = (e: any) => {
    let { features } = this.draw!.getSelected();
    if (features.length > 0) {
      console.log("getSelected", e, features);
    }
  };
  handleMousemove = (e: any) => {
    var featureIds = this.draw!.getFeatureIdsAt({ x: e.point.x, y: e.point.y });
    let features = this.draw!.getAll();
    let hovered = features.features.filter((item: any) =>
      featureIds.includes(item.id)
    );
    if (hovered.length > 0)
      this.eventManage.call("onDrawCalculateHover", hovered);
  };

  private onAreaChange = (area: number) => {
    this.area = area;
    this.eventManage.call("onAreaChange", {
      area,
      // length,
    });
  };

  // 事件
  draw_point = () => {
    if (this.draw === null) return;
    this.draw.changeMode("draw_point");
  };
  draw_line_string = () => {
    if (this.draw === null) return;
    this.draw.changeMode("draw_line_string");
  };
  draw_polygon = () => {
    if (this.draw === null) return;
    this.draw.changeMode("draw_polygon");
  };
  simple_select = () => {
    if (this.draw === null) return;
    this.draw.changeMode("simple_select");
  };
  delPolygonOrPoint = () => {
    if (this.draw === null) return;
    this.draw.trash();
  };
}
