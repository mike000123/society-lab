"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import Link from "next/link";
import { ArrowRight, Globe2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  COUNTRY_MAP,
  INDICATORS,
  getCountryColor,
  type CountryData,
  type IndicatorConfig,
  type IndicatorKey,
} from "@/lib/map/country-data";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type MapGeography = {
  id: string | number;
  rsmKey: string;
};

function ScoreBar({
  indicator,
  value,
}: {
  indicator: IndicatorConfig;
  value: number | null;
}) {
  if (value === null) {
    return <p className="text-xs italic text-slate-400">No data</p>;
  }

  const [lo, hi] = indicator.range;
  const pct = Math.max(0, Math.min(100, ((value - lo) / (hi - lo)) * 100));
  const color = getCountryColor(
    {
      alpha3: "",
      cpi: null,
      gini: null,
      name: "",
      numericId: "",
      pressFreedom: null,
      wellbeingGap: null,
      [indicator.key]: value,
    },
    indicator,
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-slate-500">
        <span>{indicator.unit}</span>
        <span className="font-semibold text-slate-800">
          {value > 0 && indicator.key === "wellbeingGap" ? `+${value}` : value}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(28,36,48,0.12)]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ backgroundColor: color, width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function CountryPanel({
  country,
  onClose,
}: {
  country: CountryData;
  onClose: () => void;
}) {
  const links: { label: string; slug: string }[] = [];

  if (country.gini !== null && country.gini > 42) {
    links.push({ label: "Wealth compounding", slug: "how-wealth-compounds-faster-than-wages" });
  }
  if (country.gini !== null && country.gini > 38) {
    links.push({ label: "Tax havens", slug: "how-tax-havens-drain-public-revenue" });
  }
  if (country.cpi !== null && country.cpi < 45) {
    links.push({ label: "Corruption as hidden tax", slug: "how-corruption-behaves-like-a-hidden-tax" });
  }
  if (country.cpi !== null && country.cpi < 50) {
    links.push({ label: "Lobbying and policy", slug: "how-lobbying-shapes-policy" });
  }
  if (country.pressFreedom !== null && country.pressFreedom < 50) {
    links.push({ label: "Media incentives", slug: "how-media-incentives-produce-outrage" });
  }
  if (country.pressFreedom !== null && country.pressFreedom < 35) {
    links.push({
      label: "Surveillance capitalism",
      slug: "how-surveillance-capitalism-shapes-attention",
    });
  }
  if (country.wellbeingGap !== null && country.wellbeingGap < -5) {
    links.push({ label: "GDP vs wellbeing", slug: "why-gdp-is-not-the-same-as-wellbeing" });
  }

  const seen = new Set<string>();
  const uniqueLinks = links.filter((link) => !seen.has(link.slug) && seen.add(link.slug));

  return (
    <div className="rounded-[1.8rem] border border-[rgba(28,36,48,0.08)] bg-white/94 p-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Selected country</p>
          <h3 className="mt-2 atlas-display text-3xl text-slate-900">{country.name}</h3>
          <p className="text-xs text-slate-500">{country.alpha3}</p>
        </div>
        <button
          className="rounded-full border border-[rgba(28,36,48,0.08)] p-2 text-slate-500 transition hover:text-slate-800"
          onClick={onClose}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4">
        {INDICATORS.map((indicator) => (
          <div key={indicator.key}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{indicator.label}</p>
            <ScoreBar indicator={indicator} value={country[indicator.key]} />
          </div>
        ))}
      </div>

      {uniqueLinks.length > 0 ? (
        <div className="mt-5 border-t border-[rgba(28,36,48,0.08)] pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Related modules</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {uniqueLinks.slice(0, 4).map((link) => (
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.9)] px-3 py-2 text-xs font-medium text-slate-700 transition hover:text-slate-900"
                href={`/learn/${link.slug}`}
                key={link.slug}
              >
                {link.label}
                <ArrowRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Legend({ indicator }: { indicator: IndicatorConfig }) {
  const [lo, hi] = indicator.range;
  const stops = indicator.stops.map((stop) => `${stop.hex} ${stop.pos * 100}%`).join(", ");
  const gradient = `linear-gradient(to right, ${stops})`;

  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-xs text-slate-400">{lo}</span>
      <div className="h-2.5 flex-1 rounded-full" style={{ background: gradient }} />
      <span className="w-16 text-right text-xs text-slate-400">{hi}</span>
      <span className="text-xs text-slate-500">{indicator.higherIsBetter ? "Higher is better" : "Lower is better"}</span>
    </div>
  );
}

export default function WorldMap() {
  const [activeIndicator, setActiveIndicator] = useState<IndicatorKey>("wellbeingGap");
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);

  const indicator = INDICATORS.find((item) => item.key === activeIndicator)!;

  return (
    <div className="space-y-5">
      <div className="rounded-[2rem] border border-[rgba(28,36,48,0.08)] bg-white/84 p-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(59,130,246,0.18)] bg-[rgba(59,130,246,0.08)] px-3 py-1 text-xs font-medium text-slate-800">
              <Globe2 className="h-3.5 w-3.5 text-[rgb(var(--atlas-primary))]" />
              Systems performance
            </div>
            <h2 className="atlas-display text-3xl text-slate-900">Compare countries by indicator</h2>
            <p className="max-w-3xl text-sm leading-7 text-slate-600">
              Choose one indicator to color the map, then click a country to compare its broader pattern and jump to
              the most relevant learning modules.
            </p>
          </div>

          <div className="text-sm text-slate-500">
            <p>Sources: World Bank, Transparency International, RSF, UNDP</p>
            <p className="mt-1 text-xs">Mixed 2022–2024 reference data</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {INDICATORS.map((item) => (
            <button
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                activeIndicator === item.key
                  ? "border-[rgba(59,130,246,0.25)] bg-[rgba(59,130,246,0.1)] text-slate-900"
                  : "border-[rgba(28,36,48,0.1)] bg-white/90 text-slate-500 hover:text-slate-800",
              )}
              key={item.key}
              onClick={() => setActiveIndicator(item.key)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>

        <p className="mt-3 text-sm text-slate-500">{indicator.description}</p>
      </div>

      <div className={cn("grid gap-5", selectedCountry ? "xl:grid-cols-[minmax(0,1fr)_20rem]" : "grid-cols-1")}>
        <div className="overflow-hidden rounded-[2rem] border border-[rgba(28,36,48,0.08)] bg-white/90 shadow-[0_18px_40px_rgba(28,36,48,0.05)]">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: [0, 20], scale: 130 }}
            style={{ height: "auto", width: "100%" }}
            viewBox="0 0 800 450"
          >
            <ZoomableGroup maxZoom={6} minZoom={0.8} zoom={1}>
              <Geographies geography={GEO_URL}>
                {({ geographies }: { geographies: MapGeography[] }) =>
                  geographies.map((geo: MapGeography) => {
                    const country = COUNTRY_MAP.get(String(geo.id));
                    const fill = getCountryColor(country, indicator);
                    const isSelected = selectedCountry?.numericId === String(geo.id);

                    return (
                      <Geography
                        className={isSelected ? "ring-1 ring-[rgb(var(--atlas-primary))]" : ""}
                        fill={fill}
                        geography={geo}
                        key={geo.rsmKey}
                        onClick={() => {
                          if (country) {
                            setSelectedCountry(country);
                          }
                        }}
                        stroke="#f5efe5"
                        strokeWidth={0.55}
                        style={{
                          default: { cursor: country ? "pointer" : "default", opacity: isSelected ? 1 : 0.9, outline: "none" },
                          hover: { cursor: country ? "pointer" : "default", opacity: 1, outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          <div className="border-t border-[rgba(28,36,48,0.08)] px-5 py-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{indicator.label}</p>
            <Legend indicator={indicator} />
            <p className="mt-3 text-xs text-slate-500">Gray countries have no data in the current dataset. Click a country to open its profile.</p>
          </div>
        </div>

        {selectedCountry ? <CountryPanel country={selectedCountry} onClose={() => setSelectedCountry(null)} /> : null}
      </div>

      {!selectedCountry ? (
        <div className="flex justify-center">
          <Button className="rounded-full px-5" type="button" variant="outline">
            Click a country on the map to open its profile
          </Button>
        </div>
      ) : null}
    </div>
  );
}
