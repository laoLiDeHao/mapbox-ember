import "./style.css";
// import typescriptLogo from "./typescript.svg";
// import viteLogo from "/vite.svg";
// import { setupCounter } from "./counter.ts";
import Emberbox from "./utils/mapbox/engine.ts";

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
const emberbox = new Emberbox(
  "app",
  "pk.eyJ1IjoiZW1iZXJlZWVlIiwiYSI6ImNsbG9tZnhhdTBjOW0zZW9hNndjMDBheWQifQ.2tdcbznsaY7x4V0snpV9ZA",
  {
    center: {
      lng: 108.948024,
      lat: 34.263161,
    },
    zoom: 14,
  }
);
console.log("init", emberbox);
