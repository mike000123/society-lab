const KNOWN_BROKEN_LEARNING_CHART_URLS = new Set<string>([
  "https://ourworldindata.org/grapher/books-printed-in-western-europe",
  "https://ourworldindata.org/grapher/corporate-tax-rates?tab=chart",
  "https://ourworldindata.org/grapher/external-debt-stocks-total-percent-gni",
  "https://ourworldindata.org/grapher/financial-crises-by-type?tab=chart",
  "https://ourworldindata.org/grapher/government-accountability-index?tab=map",
  "https://ourworldindata.org/grapher/historical-government-debt-as-a-share-of-gdp",
  "https://ourworldindata.org/grapher/historical-government-debt-as-a-share-of-gdp?country=GBR",
  "https://ourworldindata.org/grapher/historical-government-debt-as-a-share-of-gdp?country=USA",
  "https://ourworldindata.org/grapher/house-price-to-income-ratio?tab=chart",
  "https://ourworldindata.org/grapher/housing-prices-vs-wages?tab=chart",
  "https://ourworldindata.org/grapher/labour-income-share",
  "https://ourworldindata.org/grapher/literacy-rates-long-run",
  "https://ourworldindata.org/grapher/number-of-bank-failures-usa?tab=chart",
  "https://ourworldindata.org/grapher/political-rights?tab=map",
  "https://ourworldindata.org/grapher/private-debt-to-gdp?tab=chart",
  "https://ourworldindata.org/grapher/real-house-prices?tab=chart",
  "https://ourworldindata.org/grapher/real-wages-since-1283",
  "https://ourworldindata.org/grapher/share-of-children-in-employment",
  "https://ourworldindata.org/grapher/share-of-children-in-employment-male-vs-female",
  "https://ourworldindata.org/grapher/share-of-foreign-exchange-reserves-held-in-each-currency",
  "https://ourworldindata.org/grapher/share-of-population-living-in-rented-accommodation?tab=map",
  "https://ourworldindata.org/grapher/stock-market-capitalization-of-listed-domestic-companies-as-share-of-gdp",
  "https://ourworldindata.org/grapher/total-government-expenditure-as-share-of-gdp-imf?tab=chart",
  "https://ourworldindata.org/grapher/total-government-expenditure-as-share-of-gdp-imf?tab=map",
  "https://ourworldindata.org/grapher/trade-union-density",
  "https://ourworldindata.org/grapher/trust-in-government",
  "https://ourworldindata.org/grapher/trust-in-institutions?tab=chart",
]);

export function isKnownBrokenLearningChartUrl(url: string) {
  return KNOWN_BROKEN_LEARNING_CHART_URLS.has(url);
}
