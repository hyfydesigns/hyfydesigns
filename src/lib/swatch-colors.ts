// Map common Printful color names → hex. Names come from Printful's catalog
// (case-insensitive, punctuation-stripped). Anything unmatched falls back to
// a neutral tone so the swatches remain distinguishable in a hover row.
const map: Record<string, string> = {
  // Neutrals
  black: "#0A0A0A",
  blackheather: "#1F1F1F",
  heatherblack: "#1F1F1F",
  white: "#FFFFFF",
  natural: "#F4EBD9",
  cream: "#FDFBF5",
  ivory: "#F5F0E1",
  sand: "#D9C9B0",
  vintagewhite: "#F2ECDE",
  ash: "#C5C5BF",
  ashgrey: "#C5C5BF",
  athleticheather: "#B8B8B0",
  sportgrey: "#A6A6A0",
  heathergrey: "#9E9E96",
  heather: "#9E9E96",
  grey: "#8C8C86",
  gray: "#8C8C86",
  darkgrey: "#3D3D3A",
  darkgray: "#3D3D3A",
  charcoal: "#2E2E2C",
  darkheather: "#4A4A48",
  graphiteheather: "#414147",
  heathergraphite: "#414147",
  heatherdarkgrey: "#3A3A3E",
  heatherdarkgray: "#3A3A3E",

  // Blues
  navy: "#0A2A6E",
  darknavy: "#061C4A",
  blue: "#1E4FD9",
  royal: "#264ACC",
  royalblue: "#264ACC",
  trueroyal: "#1F42A0",
  sapphire: "#1863A6",
  sky: "#71B9E3",
  skyblue: "#71B9E3",
  lightblue: "#8FB4F5",
  babyblue: "#B7D3F5",
  carolinablue: "#7CB0E0",
  denim: "#3A5A80",
  indigo: "#2D2E82",
  indigoblue: "#2A3F87",
  heathernavy: "#2C3A56",
  heatherblue: "#4A6B8F",
  heathersportroyal: "#2E4A9E",
  heathersportnavy: "#2C3A56",
  heathersportdarknavy: "#1F2A45",
  teal: "#0F6E56",
  turquoise: "#25B8B8",

  // Reds and pinks
  red: "#E02D2D",
  cardinalred: "#B01F1F",
  cardinal: "#B01F1F",
  darkred: "#A31E1E",
  maroon: "#6D1E1E",
  burgundy: "#5C1B1B",
  cherry: "#C22040",
  pink: "#F5A6BE",
  lightpink: "#FBD1DC",
  hotpink: "#E5457D",
  fuchsia: "#D42F7D",
  azalea: "#EE7BA6",
  coral: "#FF7A5C",
  salmon: "#F0846E",

  // Oranges and yellows
  orange: "#FF6B2C",
  darkorange: "#C24512",
  rust: "#A6461E",
  autumn: "#B0522A",
  gold: "#E3B02F",
  yellow: "#F0D42B",
  mustard: "#C99A24",

  // Greens
  green: "#1F8A3C",
  irishgreen: "#009B48",
  forest: "#1F5A32",
  forestgreen: "#1F5A32",
  kellygreen: "#2AA042",
  kelly: "#2AA042",
  militarygreen: "#4F5A36",
  armygreen: "#575F38",
  olive: "#5F633C",
  hunter: "#264B2E",
  heatherforestgreen: "#3E6349",
  heatheririshgreen: "#2E8C4E",
  lime: "#8BC72C",
  mint: "#A6E1C1",

  // Purples
  purple: "#5A2E86",
  lavender: "#B79EDA",
  violet: "#7D4BB0",

  // Browns
  brown: "#5A3D28",
  chocolate: "#3D2A1A",
  darkchocolate: "#2B1810",
  tan: "#B58A5A",
  khaki: "#B0A17D",

  // Materials (engraving)
  wood: "#B8865A",
  metal: "#9CA3AF",
  acrylic: "#E5E7EB",
  mixed:
    "linear-gradient(45deg, #0A2A6E 25%, #E02D2D 25% 50%, #1E4FD9 50% 75%, #FDFBF5 75%)",
};

export function swatchColor(name: string): string {
  const key = name.toLowerCase().replace(/[^a-z]/g, "");
  return map[key] ?? "#B4B2A9"; // neutral warm-gray fallback
}

export function isLightSwatch(name: string): boolean {
  const key = name.toLowerCase().replace(/[^a-z]/g, "");
  return [
    "white",
    "cream",
    "natural",
    "ivory",
    "sand",
    "vintagewhite",
    "ash",
    "ashgrey",
    "babyblue",
    "lightpink",
    "mint",
    "lavender",
    "acrylic",
    "khaki",
    "athleticheather",
    "sportgrey",
    "heathergrey",
    "heather",
  ].includes(key);
}
