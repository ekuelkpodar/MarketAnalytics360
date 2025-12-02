import trends from "../data/trends.json";
import scenarios from "../data/scenarios.json";
import players from "../data/players.json";
import valueChains from "../data/valueChains.json";
import { PlayerProfile, Scenario, Trend, ValueChainMap } from "./advancedTypes";

export function getTrends(): Trend[] {
  return trends as Trend[];
}

export function getScenarios(): Scenario[] {
  return scenarios as Scenario[];
}

export function getPlayersByIndustry(industryId: string): PlayerProfile | undefined {
  return (players as PlayerProfile[]).find((p) => p.industryId === industryId);
}

export function getValueChainMap(industryId: string): ValueChainMap | undefined {
  return (valueChains as ValueChainMap[]).find((v) => v.industryId === industryId);
}
