import { emptyBuild, totalCents, type Build, type PartEntry } from "./build";
import { PARTS, type PartName } from "./parts";

/** Shown wherever a preset price is shown. Prices are snapshots, not live data. */
/** The one place to change when the prices are refreshed. */
export const PRICES_AS_OF = "Oct 2026";
export const PRICE_NOTE = `Prices as of ${PRICES_AS_OF}, check retailers.`;

export interface Preset {
  id: string;
  name: string;
  /** The main purpose, in a few words. */
  purpose: string;
  /** A short reason for the part choices. */
  why: string;
  /** Extra things to know, for example a trade-off or a platform warning. */
  notes: readonly string[];
  /** Only the parts the preset sets. Every other category stays empty. */
  parts: Readonly<Partial<Record<PartName, PartEntry>>>;
}

function part(model: string, priceCents: number): PartEntry {
  return { model, priceCents };
}

const IGPU = "Integrated Radeon graphics (in the CPU)";

/**
 * Example builds for Germany, Oct 2026. Prices are the lowest listed German offers found on
 * 29 Oct 2026 (idealo, Geizhals, hardwareschotte and similar), in integer cents.
 * Sources for every part are in buildrig-research.md.
 */
export const PRESETS: readonly Preset[] = [
  {
    id: "gaming-4k",
    name: "4K gaming, high end",
    purpose: "High-end gaming at 4K",
    why: "X3D CPU for the best gaming frame rates, an RTX 5080 for 4K, and a 4K OLED monitor to match. Built on AM5, which keeps CPU upgrades possible.",
    notes: ["The 5080 price differs a lot between shops, so check it before buying.", "A second SSD is optional and left empty."],
    parts: {
      CPU: part("AMD Ryzen 7 9850X3D", 43720),
      Motherboard: part("MSI MAG B850 Tomahawk WiFi", 21763),
      RAM: part("Kingston Fury Beast RGB 32GB DDR5-6000 CL30", 59500),
      GPU: part("Zotac GeForce RTX 5080 Solid Core OC 16GB", 159499),
      "Primary SSD": part("Samsung 990 Pro 2TB", 36800),
      Case: part("Fractal Design North XL TG Dark", 15949),
      "Power Supply": part("Corsair RM1000x SHIFT 1000W", 17799),
      Cooling: part("Arctic Liquid Freezer III Pro 360", 6690),
      Monitor: part("Gigabyte MO27U2 27in 4K 240Hz QD-OLED", 56861),
      "Extra 1": part("Logitech G Pro X TKL Rapid keyboard", 12300),
      "Extra 2": part("Logitech G Pro X Superlight 2 mouse", 9789)
    }
  },
  {
    id: "gaming-budget",
    name: "Budget gaming",
    purpose: "1080p gaming on a tight budget",
    why: `DDR5 is very expensive in ${PRICES_AS_OF}, so this uses AM4 and DDR4. A Ryzen 5 5600 and an RTX 5060 cover 1080p well, and the CPU cooler is in the box.`,
    notes: [
      `Aimed at about 1.000 euros. At ${PRICES_AS_OF} prices it lands a bit above that.`,
      "AM4 has no CPU upgrade path beyond Ryzen 5000.",
      "The RTX 5060 has 8 GB of VRAM, which some new games exceed at high settings."
    ],
    parts: {
      CPU: part("AMD Ryzen 5 5600 (boxed, with cooler)", 12488),
      Motherboard: part("Gigabyte B550 X Gaming WiFi7 (AM4)", 13599),
      RAM: part("G.Skill Aegis 16GB (2x8) DDR4-3200 CL16", 12393),
      GPU: part("MSI GeForce RTX 5060 Ventus 2X OC 8GB", 46672),
      "Primary SSD": part("Kingston NV3 1TB", 14390),
      Case: part("Montech Air 1000 Lite", 5371),
      "Power Supply": part("be quiet! System Power 11 550W", 5287),
      Cooling: part("AMD Wraith Stealth (in the CPU box)", 0),
      "Extra 1": part("Logitech G203 Lightsync mouse", 1881)
    }
  },
  {
    id: "dev-workstation",
    name: "Coding and dev workstation",
    purpose: "Coding, compiling, containers and VMs",
    why: "A 12-core Ryzen 9 for fast builds, 32 GB of RAM, a quick 2 TB SSD and a sharp 4K screen. No graphics card needed, the CPU has built-in graphics.",
    notes: [
      "The board has one HDMI output, so use HDMI for the monitor.",
      "Go to 64 GB if you run many VMs or containers.",
      "Add a graphics card later if you need CUDA or ROCm. Then use a 750 W or larger PSU."
    ],
    parts: {
      CPU: part("AMD Ryzen 9 9900X", 30800),
      Motherboard: part("MSI MAG B850 Tomahawk WiFi", 21763),
      RAM: part("Kingston Fury Beast RGB 32GB DDR5-6000 CL30", 59500),
      GPU: part(IGPU, 0),
      "Primary SSD": part("WD_BLACK SN7100 2TB", 29473),
      Case: part("Fractal Design North TG Dark", 12190),
      "Power Supply": part("be quiet! System Power 11 550W", 5287),
      Cooling: part("Thermalright Peerless Assassin 120 SE", 3429),
      Monitor: part("Dell UltraSharp U2725QE 27in 4K", 58390),
      "Extra 1": part("Logitech MX Keys S keyboard", 6999),
      "Extra 2": part("Logitech MX Master 3S mouse", 7399)
    }
  },
  {
    id: "local-ai",
    name: "Local AI and ML",
    purpose: "Running local AI models",
    why: "32 GB of VRAM on the Radeon AI PRO R9700 fits much larger models than a 16 GB gaming card. 64 GB of RAM and two 2 TB SSDs hold the models and datasets.",
    notes: [
      "The R9700 works with ROCm on Linux. If your tools need CUDA, choose an NVIDIA card instead.",
      "Confirm the power connector of the exact card model against the PSU cable.",
      "No monitor is included. Use one you already own or run it headless."
    ],
    parts: {
      CPU: part("AMD Ryzen 7 9700X", 23490),
      Motherboard: part("MSI MAG B850 Tomahawk WiFi", 21763),
      RAM: part("Crucial Pro 64GB (2x32) DDR5-6400 CL40", 92975),
      GPU: part("PowerColor Radeon AI PRO R9700 32GB", 200799),
      "Primary SSD": part("WD_BLACK SN7100 2TB", 29473),
      "Storage II": part("Kingston NV3 2TB (model files)", 25900),
      Case: part("Fractal Design North XL TG Dark", 15949),
      "Power Supply": part("be quiet! Pure Power 12 M 850W", 16990),
      Cooling: part("Thermalright Peerless Assassin 120 SE", 3429)
    }
  },
  {
    id: "content-creation",
    name: "Content creation and video",
    purpose: "Video editing and creative work",
    why: "A fast Intel CPU with a strong media engine, an RTX 5070 Ti for GPU effects and encoding, 64 GB of RAM, and a second SSD for footage. The 4K IPS monitor suits colour work.",
    notes: [
      "Intel's LGA1851 socket is rumoured to be replaced in 2027, so this platform has no upgrade path.",
      "Add a hardware colour calibrator if colour accuracy matters to you."
    ],
    parts: {
      CPU: part("Intel Core Ultra 7 270K Plus", 31900),
      Motherboard: part("ASUS TUF Gaming Z890-Plus WiFi", 23890),
      RAM: part("Crucial Pro 64GB (2x32) DDR5-6400 CL40", 92975),
      GPU: part("MSI GeForce RTX 5070 Ti 16G Ventus 3X OC", 124900),
      "Primary SSD": part("Samsung 990 Pro 2TB", 36800),
      "Storage II": part("Kingston NV3 2TB (media and cache)", 25900),
      Case: part("Fractal Design North XL TG Dark", 15949),
      "Power Supply": part("be quiet! Pure Power 12 M 850W", 16990),
      Cooling: part("Arctic Liquid Freezer III Pro 360", 6690),
      Monitor: part("Dell UltraSharp U2725QE 27in 4K", 58390),
      "Extra 1": part("Logitech MX Master 3S mouse", 7399),
      "Extra 2": part("Logitech MX Keys S keyboard", 6999)
    }
  },
  {
    id: "compact-quiet",
    name: "Compact and quiet office",
    purpose: "Small, quiet everyday PC",
    why: "A 65 W Ryzen 5 with built-in graphics in a Mini-ITX case, cooled by a low-profile Noctua. No graphics card means low noise and low power.",
    notes: [
      `16 GB of DDR5 already costs about 300 euros in ${PRICES_AS_OF}.`,
      "Fits the Fractal Terra: Mini-ITX board, SFX power supply, cooler up to 77 mm.",
      "No monitor is included."
    ],
    parts: {
      CPU: part("AMD Ryzen 5 9600X", 16900),
      Motherboard: part("ASRock B850I Lightning WiFi (Mini-ITX)", 18755),
      RAM: part("G.Skill Flare X5 16GB (2x8) DDR5-6000 CL30", 30290),
      GPU: part(IGPU, 0),
      "Primary SSD": part("Kingston NV3 1TB", 14390),
      Case: part("Fractal Design Terra", 16990),
      "Power Supply": part("be quiet! SFX Power 3 450W", 6990),
      Cooling: part("Noctua NH-L9a-AM5", 4990),
      "Extra 1": part("Logitech MK295 Silent keyboard and mouse combo", 3450)
    }
  }
];

export function getPreset(id: string): Preset | undefined {
  return PRESETS.find((preset) => preset.id === id);
}

/** A full 12-category build for a preset. Categories the preset does not set are empty. */
export function presetToBuild(preset: Preset): Build {
  const build = emptyBuild();
  for (const part of PARTS) {
    const entry = preset.parts[part];
    if (entry) build[part] = { ...entry };
  }
  return build;
}

/** Sum of the preset's part prices in cents. */
export function presetTotalCents(preset: Preset): number {
  return totalCents(presetToBuild(preset));
}
