const events = {
  // map
  onZoom: (e: number) => e, //当前地图zoom改变
  // drawCalculateUnit
  onAreaChange: (e: any) => e, //当前总面积、总长度变化
  onDrawCalculateHover: (e: any) => e, //当前绘制图形Hover数据
  // GeojsonManageUnit
  onGeoJsonMouseon: (e: any) => e, //导入的Geojson数据板换Hover数据
  onGeoJsonMouseenter: (e: any) => e, //导入的Geojson数据板换Hover数据
  onGeoJsonMouseleave: (e: any) => e, //导入的Geojson数据板换Hover数据
  // 路径展示与导航
  onNavigationPlaying: (e: any) => e,
  onNavigationReviewStart: (e: any) => e,
  onNavigationReviewPause: (e: any) => e,
  onNavigationReviewEnd: (e: any) => e,
};

export default events;
