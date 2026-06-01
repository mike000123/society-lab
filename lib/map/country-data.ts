// Country data for the world map choropleth.
// numericId matches geo.id from world-atlas@2/countries-110m.json (numeric ISO 3166-1)
// gini        0–100, higher = more unequal (World Bank ~2022)
// cpi         0–100, higher = less corrupt (Transparency International 2023)
// pressFreedom 0–100, higher = more free (RSF 2024, inverted)
// wellbeingGap -50..+50: positive means wellbeing exceeds what GDP rank predicts

export type IndicatorKey = "gini" | "cpi" | "pressFreedom" | "wellbeingGap";

export interface CountryData {
  numericId: string;
  name: string;
  alpha3: string;
  gini: number | null;
  cpi: number | null;
  pressFreedom: number | null;
  wellbeingGap: number | null;
}

export const COUNTRY_DATA: CountryData[] = [
  { numericId: "4",   name: "Afghanistan",          alpha3: "AFG", gini: 29,  cpi: 20,  pressFreedom: 18,  wellbeingGap: -8  },
  { numericId: "8",   name: "Albania",               alpha3: "ALB", gini: 34,  cpi: 37,  pressFreedom: 48,  wellbeingGap: 5   },
  { numericId: "12",  name: "Algeria",               alpha3: "DZA", gini: 35,  cpi: 36,  pressFreedom: 22,  wellbeingGap: 2   },
  { numericId: "24",  name: "Angola",                alpha3: "AGO", gini: 51,  cpi: 33,  pressFreedom: 28,  wellbeingGap: -6  },
  { numericId: "32",  name: "Argentina",             alpha3: "ARG", gini: 42,  cpi: 37,  pressFreedom: 57,  wellbeingGap: 2   },
  { numericId: "36",  name: "Australia",             alpha3: "AUS", gini: 34,  cpi: 75,  pressFreedom: 75,  wellbeingGap: 2   },
  { numericId: "40",  name: "Austria",               alpha3: "AUT", gini: 30,  cpi: 71,  pressFreedom: 79,  wellbeingGap: 1   },
  { numericId: "50",  name: "Bangladesh",            alpha3: "BGD", gini: 32,  cpi: 24,  pressFreedom: 41,  wellbeingGap: -2  },
  { numericId: "56",  name: "Belgium",               alpha3: "BEL", gini: 27,  cpi: 73,  pressFreedom: 78,  wellbeingGap: 1   },
  { numericId: "68",  name: "Bolivia",               alpha3: "BOL", gini: 44,  cpi: 31,  pressFreedom: 52,  wellbeingGap: 7   },
  { numericId: "76",  name: "Brazil",                alpha3: "BRA", gini: 52,  cpi: 36,  pressFreedom: 58,  wellbeingGap: 0   },
  { numericId: "100", name: "Bulgaria",              alpha3: "BGR", gini: 40,  cpi: 45,  pressFreedom: 46,  wellbeingGap: 3   },
  { numericId: "104", name: "Myanmar",               alpha3: "MMR", gini: 30,  cpi: 23,  pressFreedom: 12,  wellbeingGap: -3  },
  { numericId: "116", name: "Cambodia",              alpha3: "KHM", gini: 38,  cpi: 22,  pressFreedom: 19,  wellbeingGap: 1   },
  { numericId: "124", name: "Canada",                alpha3: "CAN", gini: 33,  cpi: 76,  pressFreedom: 74,  wellbeingGap: 1   },
  { numericId: "144", name: "Sri Lanka",             alpha3: "LKA", gini: 39,  cpi: 34,  pressFreedom: 39,  wellbeingGap: 6   },
  { numericId: "152", name: "Chile",                 alpha3: "CHL", gini: 44,  cpi: 66,  pressFreedom: 63,  wellbeingGap: 3   },
  { numericId: "156", name: "China",                 alpha3: "CHN", gini: 38,  cpi: 42,  pressFreedom: 3,   wellbeingGap: 3   },
  { numericId: "170", name: "Colombia",              alpha3: "COL", gini: 51,  cpi: 39,  pressFreedom: 44,  wellbeingGap: 2   },
  { numericId: "188", name: "Costa Rica",            alpha3: "CRI", gini: 48,  cpi: 54,  pressFreedom: 72,  wellbeingGap: 20  },
  { numericId: "191", name: "Croatia",               alpha3: "HRV", gini: 29,  cpi: 50,  pressFreedom: 60,  wellbeingGap: 3   },
  { numericId: "192", name: "Cuba",                  alpha3: "CUB", gini: null, cpi: 46,  pressFreedom: 16,  wellbeingGap: 25  },
  { numericId: "203", name: "Czech Republic",        alpha3: "CZE", gini: 25,  cpi: 56,  pressFreedom: 71,  wellbeingGap: 2   },
  { numericId: "208", name: "Denmark",               alpha3: "DNK", gini: 29,  cpi: 90,  pressFreedom: 90,  wellbeingGap: 1   },
  { numericId: "218", name: "Ecuador",               alpha3: "ECU", gini: 45,  cpi: 34,  pressFreedom: 50,  wellbeingGap: 6   },
  { numericId: "231", name: "Ethiopia",              alpha3: "ETH", gini: 35,  cpi: 37,  pressFreedom: 26,  wellbeingGap: -4  },
  { numericId: "246", name: "Finland",               alpha3: "FIN", gini: 27,  cpi: 87,  pressFreedom: 90,  wellbeingGap: 1   },
  { numericId: "250", name: "France",                alpha3: "FRA", gini: 32,  cpi: 71,  pressFreedom: 68,  wellbeingGap: 2   },
  { numericId: "276", name: "Germany",               alpha3: "DEU", gini: 31,  cpi: 78,  pressFreedom: 79,  wellbeingGap: 1   },
  { numericId: "288", name: "Ghana",                 alpha3: "GHA", gini: 43,  cpi: 43,  pressFreedom: 59,  wellbeingGap: 0   },
  { numericId: "300", name: "Greece",                alpha3: "GRC", gini: 34,  cpi: 48,  pressFreedom: 58,  wellbeingGap: 2   },
  { numericId: "320", name: "Guatemala",             alpha3: "GTM", gini: 48,  cpi: 26,  pressFreedom: 42,  wellbeingGap: -2  },
  { numericId: "340", name: "Honduras",              alpha3: "HND", gini: 48,  cpi: 23,  pressFreedom: 35,  wellbeingGap: -3  },
  { numericId: "348", name: "Hungary",               alpha3: "HUN", gini: 30,  cpi: 42,  pressFreedom: 42,  wellbeingGap: 1   },
  { numericId: "356", name: "India",                 alpha3: "IND", gini: 35,  cpi: 39,  pressFreedom: 31,  wellbeingGap: -2  },
  { numericId: "360", name: "Indonesia",             alpha3: "IDN", gini: 38,  cpi: 34,  pressFreedom: 56,  wellbeingGap: -1  },
  { numericId: "364", name: "Iran",                  alpha3: "IRN", gini: 42,  cpi: 25,  pressFreedom: 10,  wellbeingGap: 0   },
  { numericId: "368", name: "Iraq",                  alpha3: "IRQ", gini: 30,  cpi: 23,  pressFreedom: 21,  wellbeingGap: -5  },
  { numericId: "372", name: "Ireland",               alpha3: "IRL", gini: 31,  cpi: 77,  pressFreedom: 84,  wellbeingGap: 1   },
  { numericId: "376", name: "Israel",                alpha3: "ISR", gini: 39,  cpi: 62,  pressFreedom: 53,  wellbeingGap: 1   },
  { numericId: "380", name: "Italy",                 alpha3: "ITA", gini: 35,  cpi: 56,  pressFreedom: 65,  wellbeingGap: 1   },
  { numericId: "392", name: "Japan",                 alpha3: "JPN", gini: 33,  cpi: 73,  pressFreedom: 46,  wellbeingGap: 3   },
  { numericId: "400", name: "Jordan",                alpha3: "JOR", gini: 34,  cpi: 45,  pressFreedom: 32,  wellbeingGap: 2   },
  { numericId: "404", name: "Kenya",                 alpha3: "KEN", gini: 40,  cpi: 31,  pressFreedom: 48,  wellbeingGap: -5  },
  { numericId: "408", name: "North Korea",           alpha3: "PRK", gini: null, cpi: 17,  pressFreedom: 2,   wellbeingGap: null},
  { numericId: "410", name: "South Korea",           alpha3: "KOR", gini: 31,  cpi: 63,  pressFreedom: 62,  wellbeingGap: 4   },
  { numericId: "422", name: "Lebanon",               alpha3: "LBN", gini: 31,  cpi: 24,  pressFreedom: 33,  wellbeingGap: 4   },
  { numericId: "434", name: "Libya",                 alpha3: "LBY", gini: null, cpi: 18,  pressFreedom: 15,  wellbeingGap: -8  },
  { numericId: "458", name: "Malaysia",              alpha3: "MYS", gini: 41,  cpi: 50,  pressFreedom: 52,  wellbeingGap: 0   },
  { numericId: "484", name: "Mexico",                alpha3: "MEX", gini: 43,  cpi: 31,  pressFreedom: 33,  wellbeingGap: 1   },
  { numericId: "504", name: "Morocco",               alpha3: "MAR", gini: 40,  cpi: 38,  pressFreedom: 29,  wellbeingGap: 2   },
  { numericId: "508", name: "Mozambique",            alpha3: "MOZ", gini: 54,  cpi: 26,  pressFreedom: 41,  wellbeingGap: -4  },
  { numericId: "516", name: "Namibia",               alpha3: "NAM", gini: 59,  cpi: 49,  pressFreedom: 58,  wellbeingGap: -2  },
  { numericId: "528", name: "Netherlands",           alpha3: "NLD", gini: 28,  cpi: 79,  pressFreedom: 87,  wellbeingGap: 1   },
  { numericId: "554", name: "New Zealand",           alpha3: "NZL", gini: 33,  cpi: 85,  pressFreedom: 81,  wellbeingGap: 2   },
  { numericId: "566", name: "Nigeria",               alpha3: "NGA", gini: 43,  cpi: 25,  pressFreedom: 43,  wellbeingGap: -8  },
  { numericId: "578", name: "Norway",                alpha3: "NOR", gini: 26,  cpi: 84,  pressFreedom: 92,  wellbeingGap: 1   },
  { numericId: "586", name: "Pakistan",              alpha3: "PAK", gini: 29,  cpi: 28,  pressFreedom: 38,  wellbeingGap: -4  },
  { numericId: "604", name: "Peru",                  alpha3: "PER", gini: 43,  cpi: 33,  pressFreedom: 50,  wellbeingGap: 5   },
  { numericId: "608", name: "Philippines",           alpha3: "PHL", gini: 40,  cpi: 34,  pressFreedom: 40,  wellbeingGap: 8   },
  { numericId: "616", name: "Poland",                alpha3: "POL", gini: 30,  cpi: 54,  pressFreedom: 66,  wellbeingGap: 2   },
  { numericId: "620", name: "Portugal",              alpha3: "PRT", gini: 33,  cpi: 61,  pressFreedom: 83,  wellbeingGap: 2   },
  { numericId: "642", name: "Romania",               alpha3: "ROU", gini: 35,  cpi: 46,  pressFreedom: 54,  wellbeingGap: 3   },
  { numericId: "643", name: "Russia",                alpha3: "RUS", gini: 36,  cpi: 26,  pressFreedom: 7,   wellbeingGap: -5  },
  { numericId: "682", name: "Saudi Arabia",          alpha3: "SAU", gini: null, cpi: 52,  pressFreedom: 11,  wellbeingGap: -18 },
  { numericId: "694", name: "Sierra Leone",          alpha3: "SLE", gini: 35,  cpi: 34,  pressFreedom: 50,  wellbeingGap: -2  },
  { numericId: "704", name: "Vietnam",               alpha3: "VNM", gini: 36,  cpi: 41,  pressFreedom: 18,  wellbeingGap: 18  },
  { numericId: "710", name: "South Africa",          alpha3: "ZAF", gini: 63,  cpi: 41,  pressFreedom: 55,  wellbeingGap: -10 },
  { numericId: "716", name: "Zimbabwe",              alpha3: "ZWE", gini: 50,  cpi: 24,  pressFreedom: 30,  wellbeingGap: -5  },
  { numericId: "724", name: "Spain",                 alpha3: "ESP", gini: 35,  cpi: 60,  pressFreedom: 67,  wellbeingGap: 2   },
  { numericId: "752", name: "Sweden",                alpha3: "SWE", gini: 27,  cpi: 82,  pressFreedom: 88,  wellbeingGap: 2   },
  { numericId: "756", name: "Switzerland",           alpha3: "CHE", gini: 33,  cpi: 82,  pressFreedom: 82,  wellbeingGap: 1   },
  { numericId: "760", name: "Syria",                 alpha3: "SYR", gini: null, cpi: 13,  pressFreedom: 12,  wellbeingGap: -12 },
  { numericId: "764", name: "Thailand",              alpha3: "THA", gini: 36,  cpi: 35,  pressFreedom: 35,  wellbeingGap: 4   },
  { numericId: "788", name: "Tunisia",               alpha3: "TUN", gini: 33,  cpi: 40,  pressFreedom: 34,  wellbeingGap: 3   },
  { numericId: "792", name: "Turkey",                alpha3: "TUR", gini: 41,  cpi: 34,  pressFreedom: 21,  wellbeingGap: 1   },
  { numericId: "800", name: "Uganda",                alpha3: "UGA", gini: 43,  cpi: 26,  pressFreedom: 37,  wellbeingGap: -3  },
  { numericId: "804", name: "Ukraine",               alpha3: "UKR", gini: 25,  cpi: 36,  pressFreedom: 61,  wellbeingGap: 12  },
  { numericId: "818", name: "Egypt",                 alpha3: "EGY", gini: 32,  cpi: 35,  pressFreedom: 24,  wellbeingGap: -3  },
  { numericId: "826", name: "United Kingdom",        alpha3: "GBR", gini: 35,  cpi: 71,  pressFreedom: 72,  wellbeingGap: 1   },
  { numericId: "840", name: "United States",         alpha3: "USA", gini: 41,  cpi: 69,  pressFreedom: 66,  wellbeingGap: -3  },
  { numericId: "858", name: "Uruguay",               alpha3: "URY", gini: 40,  cpi: 73,  pressFreedom: 77,  wellbeingGap: 4   },
  { numericId: "862", name: "Venezuela",             alpha3: "VEN", gini: 45,  cpi: 13,  pressFreedom: 27,  wellbeingGap: 3   },
  { numericId: "887", name: "Yemen",                 alpha3: "YEM", gini: null, cpi: 16,  pressFreedom: 14,  wellbeingGap: -10 },
];

// Build a lookup map for O(1) access by numeric ID
export const COUNTRY_MAP = new Map<string, CountryData>(
  COUNTRY_DATA.map((c) => [c.numericId, c])
);

export interface IndicatorConfig {
  key: IndicatorKey;
  label: string;
  description: string;
  range: [number, number];
  higherIsBetter: boolean;
  unit: string;
  stops: { pos: number; hex: string }[];
  relatedModule?: { slug: string; label: string };
}

export const INDICATORS: IndicatorConfig[] = [
  {
    key: "gini",
    label: "Inequality",
    description: "Gini coefficient — measures income inequality. Higher = more unequal.",
    range: [20, 65],
    higherIsBetter: false,
    unit: "Gini index",
    stops: [
      { pos: 0,   hex: "#22c55e" },
      { pos: 0.5, hex: "#fbbf24" },
      { pos: 1,   hex: "#ef4444" },
    ],
    relatedModule: { slug: "how-wealth-compounds-faster-than-wages", label: "Why wealth compounds faster than wages" },
  },
  {
    key: "cpi",
    label: "Corruption",
    description: "Corruption Perception Index — higher score means less corruption.",
    range: [0, 100],
    higherIsBetter: true,
    unit: "CPI score",
    stops: [
      { pos: 0,   hex: "#ef4444" },
      { pos: 0.5, hex: "#fbbf24" },
      { pos: 1,   hex: "#22c55e" },
    ],
    relatedModule: { slug: "how-corruption-behaves-like-a-hidden-tax", label: "How corruption behaves like a hidden tax" },
  },
  {
    key: "pressFreedom",
    label: "Press Freedom",
    description: "RSF Press Freedom Index — higher = more press freedom.",
    range: [0, 100],
    higherIsBetter: true,
    unit: "Freedom score",
    stops: [
      { pos: 0,   hex: "#ef4444" },
      { pos: 0.5, hex: "#fbbf24" },
      { pos: 1,   hex: "#22c55e" },
    ],
    relatedModule: { slug: "how-media-incentives-produce-outrage", label: "How media incentives produce outrage" },
  },
  {
    key: "wellbeingGap",
    label: "Wellbeing Gap",
    description: "Wellbeing vs GDP gap — positive means wellbeing exceeds what income predicts.",
    range: [-50, 50],
    higherIsBetter: true,
    unit: "Gap score",
    stops: [
      { pos: 0,   hex: "#ef4444" },
      { pos: 0.5, hex: "#64748b" },
      { pos: 1,   hex: "#22c55e" },
    ],
    relatedModule: { slug: "why-gdp-is-not-the-same-as-wellbeing", label: "Why GDP is not the same as wellbeing" },
  },
];

// Returns a fill color for a country/indicator, or a default gray
export function getCountryColor(country: CountryData | undefined, indicator: IndicatorConfig): string {
  if (!country) return "#1e293b";
  const raw = country[indicator.key];
  if (raw === null || raw === undefined) return "#1e293b";

  const [lo, hi] = indicator.range;
  const t = Math.max(0, Math.min(1, (raw - lo) / (hi - lo)));

  const stops = indicator.stops;
  for (let i = 0; i < stops.length - 1; i++) {
    if (t <= stops[i + 1].pos) {
      const a = stops[i], b = stops[i + 1];
      const f = (t - a.pos) / (b.pos - a.pos);
      const ah = parseInt(a.hex.slice(1), 16);
      const bh = parseInt(b.hex.slice(1), 16);
      const r = Math.round(((ah >> 16) & 0xff) + (((bh >> 16) & 0xff) - ((ah >> 16) & 0xff)) * f);
      const g = Math.round(((ah >> 8) & 0xff) + (((bh >> 8) & 0xff) - ((ah >> 8) & 0xff)) * f);
      const bl = Math.round((ah & 0xff) + ((bh & 0xff) - (ah & 0xff)) * f);
      return `rgb(${r},${g},${bl})`;
    }
  }
  return stops[stops.length - 1].hex;
}
