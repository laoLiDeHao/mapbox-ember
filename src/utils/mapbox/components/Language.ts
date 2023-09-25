import MapboxLanguage from "@mapbox/mapbox-gl-language";

export default class Language {
  map: any;

  constructor(map: any) {
    map.addControl(
      new MapboxLanguage({
        defaultLanguage: "zh-Hans",
      })
    );

    this.map = map;
  }

  set = (
    lang: "en" | "es" | "fr" | "de" | "ar" | "zh-Hans" | "zh-Hant" | "ja" | "ko"
  ) => {
    this.map.setLanguage(lang);
  };
}

// 英语： 语言代码 'en'，关键词 'English'
// 西班牙语： 语言代码 'es'，关键词 'Spanish'
// 法语： 语言代码 'fr'，关键词 'French'
// 德语： 语言代码 'de'，关键词 'German'
// 阿拉伯语： 语言代码 'ar'，关键词 'Arabic'
// 中文（简体）： 语言代码 'zh'，关键词 'Chinese (Simplified)'
// 中文（繁体）： 语言代码 'zh-TW'，关键词 'Chinese (Traditional)'
// 日语： 语言代码 'ja'，关键词 'Japanese'
// 韩语： 语言代码 'ko'，关键词 'Korean'
