/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import IndustrySidebar from "../components/IndustrySidebar";
import FilterBar from "../components/FilterBar";
import OverviewPanel from "../components/OverviewPanel";
import DemographicsPanel from "../components/DemographicsPanel";
import BusinessValueChainPanel from "../components/BusinessValueChainPanel";
import MacroEnvironmentPanel from "../components/MacroEnvironmentPanel";
import LeadingIndicatorsPanel from "../components/LeadingIndicatorsPanel";
import LaggingIndicatorsPanel from "../components/LaggingIndicatorsPanel";
import AiReportPanel from "../components/AiReportPanel";
import { getIndustriesList, getIndustryData } from "../lib/dataLoader";
import { Region, Scenario, TimeHorizon } from "../lib/domainTypes";

const industries = getIndustriesList();

export default function Page() {
  const [selectedIndustryId, setSelectedIndustryId] = useState(industries[0]?.id ?? "automotive");
  const [region, setRegion] = useState<Region>("Global");
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>("Short-term");
  const [scenario, setScenario] = useState<Scenario>("Baseline");
  const [filterText, setFilterText] = useState("");

  const bundle = useMemo(() => getIndustryData(selectedIndustryId), [selectedIndustryId]);

  return (
    <div className="flex min-h-screen">
      <IndustrySidebar
        industries={industries}
        selectedId={selectedIndustryId}
        onSelect={setSelectedIndustryId}
        filterText={filterText}
        onFilterChange={setFilterText}
      />
      <div className="flex-1">
        <FilterBar
          region={region}
          timeHorizon={timeHorizon}
          scenario={scenario}
          onRegionChange={setRegion}
          onTimeChange={setTimeHorizon}
          onScenarioChange={setScenario}
        />
        <main className="space-y-4 p-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <OverviewPanel industry={bundle.industry} />
            <DemographicsPanel demographics={bundle.demographics} />
          </div>
          <BusinessValueChainPanel industry={bundle.industry} />
          <MacroEnvironmentPanel macro={bundle.macro} />
          <LeadingIndicatorsPanel indicators={bundle.indicators} />
          <LaggingIndicatorsPanel indicators={bundle.indicators} />
          <AiReportPanel bundle={bundle} region={region} timeHorizon={timeHorizon} scenario={scenario} />
        </main>
      </div>
    </div>
  );
}
