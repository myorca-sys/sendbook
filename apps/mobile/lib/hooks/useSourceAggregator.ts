import { useState, useCallback, useEffect } from "react";
import { fetchProviderSources } from "./aggregatorHelpers";

export function useSourceAggregator(titles: string[], episode: string, mainProvider: string) {
  const [aggregatedSources, setAggregatedSources] = useState<any[]>([]);
  const [isAggregating, setIsAggregating] = useState(false);

  const providers = ["samehadaku", "kuronime"].filter((p) => p !== mainProvider);

  const aggregate = useCallback(async () => {
    if (!titles.length || !episode) return;
    setIsAggregating(true);
    setAggregatedSources([]); // Clear previous sources
    console.log(
      `[Aggregator] Starting parallel search for: "${titles[0]}" + ${titles.length - 1} variants (Eps ${episode})`,
    );

    const allResults = await Promise.all(
      providers.map((p) => fetchProviderSources(p, titles, episode)),
    );
    setAggregatedSources(allResults.flat());
    setIsAggregating(false);
  }, [titles, episode, mainProvider]);

  useEffect(() => {
    setAggregatedSources([]);
    aggregate();
  }, [episode, titles.join("|")]);

  return { aggregatedSources, isAggregating };
}
