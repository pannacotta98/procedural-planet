import {merge} from "../_snowpack/pkg/lodash.js";
const defaultConfig = {
  terrain: {
    offsetScale: 0.3,
    numOctaves: 8,
    lacunarity: 2,
    persistance: 0.5,
    baseFreq: 1.2,
    exponent: 3,
    wireframe: false,
    absInvert: false,
    snowColor: "#ffffff",
    mountainColor: "#808080",
    landColor: "#94C245",
    sandColor: "#ECECAB"
  },
  atmosphere: {
    opacity: 0.5,
    fresnel: 3,
    wireframe: false,
    color: "#1f75ff"
  },
  clouds: {
    amount: 0.5,
    opacity: 1,
    height: 1.1,
    smoothness: 0.5,
    warp: 0.13
  },
  water: {
    height: 1.035,
    wavesIntensity: 2e-3,
    wavesSize: 120,
    wavesSpeed: 3,
    opacity: 0.7,
    color: "#318FD7",
    useFresnel: true,
    useTrochoidalWaves: false
  },
  camera: {
    autoRotate: false
  }
};
export class ConfigIntValMeta {
  constructor(min, max, label) {
    this.min = min;
    this.max = max;
    this.label = label;
  }
}
export class ConfigFloatValMeta {
  constructor(min, max, label) {
    this.min = min;
    this.max = max;
    this.label = label;
  }
}
export class ConfigBoolValMeta {
  constructor(label) {
    this.label = label;
  }
}
export class ConfigColorValMeta {
  constructor(label) {
    this.label = label;
  }
}
export const configMetaData = {
  terrain: {
    offsetScale: new ConfigFloatValMeta(1e-3, 1, "Offset scale"),
    numOctaves: new ConfigIntValMeta(1, 10, "Number of octaves"),
    lacunarity: new ConfigFloatValMeta(1.1, 3, "Lacunarity"),
    persistance: new ConfigFloatValMeta(0.1, 0.7, "Persistance"),
    baseFreq: new ConfigFloatValMeta(0.5, 4, "Fundamental frequency"),
    exponent: new ConfigFloatValMeta(0.01, 5, "Exponent"),
    wireframe: new ConfigBoolValMeta("Wireframe"),
    absInvert: new ConfigBoolValMeta("Abs invert"),
    snowColor: new ConfigColorValMeta("Snow color"),
    mountainColor: new ConfigColorValMeta("Mountains color"),
    landColor: new ConfigColorValMeta("Land color"),
    sandColor: new ConfigColorValMeta("Sand color")
  },
  atmosphere: {
    wireframe: new ConfigBoolValMeta("Wireframe"),
    opacity: new ConfigFloatValMeta(0, 1, "Opacity"),
    fresnel: new ConfigFloatValMeta(0, 10, "Fresnel"),
    color: new ConfigColorValMeta("Color")
  },
  clouds: {
    opacity: new ConfigFloatValMeta(0, 1, "Opacity"),
    amount: new ConfigFloatValMeta(0, 1, "Amount"),
    height: new ConfigFloatValMeta(0.9, 1.3, "Height"),
    smoothness: new ConfigFloatValMeta(0, 1, "Smoothness"),
    warp: new ConfigFloatValMeta(0, 1, "Warp")
  },
  water: {
    height: new ConfigFloatValMeta(0.98, 1.1, "Water level"),
    wavesIntensity: new ConfigFloatValMeta(0, 4e-3, "Wave height"),
    wavesSize: new ConfigFloatValMeta(30, 400, "Wave scale"),
    wavesSpeed: new ConfigFloatValMeta(0, 10, "Wave speed"),
    opacity: new ConfigFloatValMeta(0, 1, "Opacity"),
    color: new ConfigColorValMeta("Color"),
    useFresnel: new ConfigBoolValMeta("Use Fresnel"),
    useTrochoidalWaves: new ConfigBoolValMeta("Trochoidal waves")
  },
  camera: {
    autoRotate: new ConfigBoolValMeta("Auto-rotate")
  }
};
function cloneConfig(config) {
  return JSON.parse(JSON.stringify(config));
}
export let activeConfig = cloneConfig(defaultConfig);
export function loadPreset(preset) {
  activeConfig = merge(cloneConfig(defaultConfig), cloneConfig(preset));
}
export function configAsJSON() {
  return JSON.stringify(activeConfig);
}
export const presets = new Map();
presets.set("Default", defaultConfig);
presets.set("Water debug", {
  terrain: {offsetScale: 0, numOctaves: 1, wireframe: false},
  atmosphere: {wireframe: false, opacity: 0},
  clouds: {opacity: 0}
});
presets.set("No clouds or atmosphere", {
  atmosphere: {opacity: 0},
  clouds: {opacity: 0}
});
presets.set("Ceeeraazyy", {
  terrain: {
    offsetScale: 0.3,
    numOctaves: 8,
    lacunarity: 2,
    persistance: 0.5,
    baseFreq: 1.2,
    exponent: 3,
    wireframe: false,
    absInvert: false,
    snowColor: "#ff0000",
    mountainColor: "#00ff04",
    landColor: "#c70000",
    sandColor: "#ffffff"
  },
  atmosphere: {opacity: 0.09, wireframe: false, color: "#ff00f7"},
  clouds: {opacity: 0, height: 1.1},
  water: {height: 1.0088},
  camera: {autoRotate: false}
});