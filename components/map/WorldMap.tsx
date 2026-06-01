"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import Link from "next/link";
import { X, ArrowRight, Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  COUNTRY_MAP,
  INDICATORS,
  getCountryColor,
  type CountryData,
  type IndicatorKey,
  type IndicatorConfig,
} from "@/lib/map/country-data";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type MapGeography = {
  id: string | number;
  rsmKey: string;
};

// ─── Score bar ────────────────────────────────────────────────────────────────
function ScoreBar({
  value,
  indicator,
}: {
  value: number | null;
  indicator: IndicatorConfig;
}) {
  if (value === null) {
    return <p className="text-xs text-slate-500 italic">No data</p>;
  }
  const [lo, hi] = indicator.range;
  const pct = Math.max(0, Math.min(100, ((value - lo) / (hi - lo)) * 100));
  const color = getCountryColor(
    { numericId: "", name: "", alpha3: "", gini: null, cpi: null, pressFreedom: null, wellbeingGap: null, [indicator.key]: value },
    indicator
  );

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-400">
        <span>{indicator.unit}</span>
        <span className="font-semibold text-slate-200">{value > 0 && indicator.key === "wellbeingGap" ? `+${value}` : value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ─── Country panel ────────────────────────────────────────────────────────────
function CountryPanel({
  country,
  onClose,
}: {
  country: CountryData;
  onClose: () => void;
}) {
  // Derive relevant module links based on concerning values
  const links: { slug: string; label: string }[] = [];
  if (country.gini !== null && country.gini > 42)
    links.push({ slug: "how-wealth-compounds-faster-than-wages", label: "Wealth compounding" });
  if (country.gini !== null && country.gini > 38)
    links.push({ slug: "how-tax-havens-drain-public-revenue", label: "Tax havens" });
  if (country.cpi !== null && country.cpi < 45)
    links.push({ slug: "how-corruption-behaves-like-a-hidden-tax", label: "Corruption as hidden tax" });
  if (country.cpi !== null && country.cpi < 50)
    links.push({ slug: "how-lobbying-shapes-policy", label: "Lobbying & policy" });
  if (country.pressFreedom !== null && country.pressFreedom < 50)
    links.push({ slug: "how-media-incentives-produce-outrage", label: "Media incentives" });
  if (country.pressFreedom !== null && country.pressFreedom < 35)
    links.push({ slug: "how-surveillance-capitalism-shapes-attention", label: "Surveillance capitalism" });
  if (country.wellbeingGap !== null && country.wellbeingGap < -5)
    links.push({ slug: "why-gdp-is-not-the-same-as-wellbeing", label: "GDP vs wellbeing" });

  // Deduplicate
  const seen = new Set<string>();
  const uniqueLinks = links.filter((l) => !seen.has(l.slug) && seen.add(l.slug));

  return (
    <div className="rounded-[1.75rem] border border-slate-700 bg-slate-900/95 p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Selected country</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-50">{country.name}</h3>
          <p className="text-xs text-slate-500">{country.alpha3}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-xl border border-slate-700 p-1.5 text-slate-400 hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {INDICATORS.map((ind) => (
          <div key={ind.key}>
            <p className="mb-1.5 text-xs font-medium text-slate-400">{ind.label}</p>
            <ScoreBar value={country[ind.key]} indicator={ind} />
          </div>
        ))}
      </div>

      {uniqueLinks.length > 0 && (
        <div className="border-t border-slate-800 pt-4 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Related modules</p>
          <div className="flex flex-wrap gap-2">
            {uniqueLinks.slice(0, 4).map((l) => (
              <Link
                key={l.slug}
                href={`/learn/${l.slug}`}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-600 hover:text-cyan-200 transition-colors"
              >
                {l.label}
                <ArrowRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Color legend ─────────────────────────────────────────────────────────────
function Legend({ indicator }: { indicator: IndicatorConfig }) {
  const [lo, hi] = indicator.range;
  const stops = indicator.stops.map((s) => `${s.hex} ${s.pos * 100}%`).join(", ");
  const gradient = `linear-gradient(to right, ${stops})`;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 w-20 text-right">
        {lo}{indicator.key === "wellbeingGap" ? "" : ""}
      </span>
      <div className="flex-1 h-2.5 rounded-full" style={{ background: gradient }} />
      <span className="text-xs text-slate-500 w-20">{hi}</span>
      <span className="text-xs text-slate-400 ml-1">
        ({indicator.higherIsBetter ? "↑ better" : "↓ better"})
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function WorldMap() {
  const [activeIndicator, setActiveIndicator] = useState<IndicatorKey>("gini");
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);

  const indicator = INDICATORS.find((i) => i.key === activeIndicator)!;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/85 p-6 sm:p-8">
        <div className="flex items-start gap-4 flex-wrap justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100">
              <Globe2 className="h-3.5 w-3.5" /> System map
            </span>
            <h1 className="text-3xl font-black text-slate-50">How systems compare across countries</h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-300">
              Select an indicator to colour each country. Click a country to see all four scores and
              jump to the relevant learning module.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Sources: World Bank · Transparency International · RSF · UNDP</p>
            <p className="text-xs text-slate-600 mt-0.5">~2022–2024 data</p>
          </div>
        </div>

        {/* Indicator tabs */}
        <div className="mt-5 flex flex-wrap gap-2">
          {INDICATORS.map((ind) => (
            <button
              key={ind.key}
              onClick={() => setActiveIndicator(ind.key)}
              className={cn(
                "rounded-2xl border px-4 py-2 text-sm font-medium transition-colors",
                activeIndicator === ind.key
                  ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-100"
                  : "border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-500 hover:text-slate-200"
              )}
            >
              {ind.label}
            </button>
          ))}
        </div>

        <p className="mt-3 text-xs text-slate-500">{indicator.description}</p>
      </div>

      {/* Map + panel */}
      <div className={cn("grid gap-4", selectedCountry ? "lg:grid-cols-[1fr_360px]" : "grid-cols-1")}>
        {/* Choropleth */}
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/85 overflow-hidden">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 130, center: [0, 20] }}
            style={{ width: "100%", height: "auto" }}
            viewBox="0 0 800 450"
          >
            <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={6}>
              <Geographies geography={GEO_URL}>
                {({ geographies }: { geographies: MapGeography[] }) =>
                  geographies.map((geo: MapGeography) => {
                    const country = COUNTRY_MAP.get(String(geo.id));
                    const fill = getCountryColor(country, indicator);
                    const isSelected = selectedCountry?.numericId === String(geo.id);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke="#0f172a"
                        strokeWidth={0.4}
                        style={{
                          default: { outline: "none", opacity: isSelected ? 1 : 0.85 },
                          hover:   { outline: "none", opacity: 1, cursor: country ? "pointer" : "default" },
                          pressed: { outline: "none" },
                        }}
                        className={isSelected ? "ring-1 ring-cyan-400" : ""}
                        onClick={() => {
                          if (country) setSelectedCountry(country);
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* Legend */}
          <div className="border-t border-slate-800 px-5 py-3">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">{indicator.label}</p>
            <Legend indicator={indicator} />
            <p className="mt-2 text-xs text-slate-600">
              Gray = no data available · Scroll/pinch to zoom · Click country for details
            </p>
          </div>
        </div>

        {/* Country panel */}
        {selectedCountry && (
          <CountryPanel
            country={selectedCountry}
            onClose={() => setSelectedCountry(null)}
          />
        )}
      </div>

      {/* Empty state prompt */}
      {!selectedCountry && (
        <p className="text-center text-sm text-slate-600">
          Click any country on the map to see its scores across all four indicators and find related modules.
        </p>
      )}
    </div>
  );
}
