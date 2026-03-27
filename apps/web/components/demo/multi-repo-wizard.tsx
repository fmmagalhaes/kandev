"use client";

import { useState, useCallback } from "react";
import { DEMO_DISCOVERED_REPOS, type DemoDiscoveredRepo } from "@/lib/demo/demo-multi-repo";
import { DescribeStep, DiscoveryStep, RepoSelectionStep } from "./multi-repo-steps";

type WizardStep = "describe" | "discovery" | "repos";

export type MultiRepoWizardResult = {
  title: string;
  description: string;
  repos: DemoDiscoveredRepo[];
  planMode: boolean;
};

type MultiRepoWizardProps = {
  title: string;
  onSubmit: (result: MultiRepoWizardResult) => void;
  onCancel: () => void;
};

export function MultiRepoWizard({ title, onSubmit, onCancel }: MultiRepoWizardProps) {
  const [step, setStep] = useState<WizardStep>("describe");
  const [description, setDescription] = useState("");
  const [selectedRepos, setSelectedRepos] = useState<DemoDiscoveredRepo[]>([
    ...DEMO_DISCOVERED_REPOS,
  ]);
  const [planMode, setPlanMode] = useState(false);

  const handleDescribeNext = useCallback(() => setStep("discovery"), []);
  const handleDiscoveryComplete = useCallback(() => setStep("repos"), []);

  const handleBack = useCallback(() => {
    if (step === "repos") setStep("describe");
  }, [step]);

  const handleSubmit = useCallback(
    (start: boolean) => {
      onSubmit({ title, description, repos: selectedRepos, planMode: start ? planMode : false });
    },
    [title, description, selectedRepos, planMode, onSubmit],
  );

  const stepIndex = ["describe", "discovery", "repos"].indexOf(step);
  const STEP_LABELS = ["Describe", "Discover", "Select & Launch"];

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <div className="flex items-center gap-2 px-1">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 text-xs ${
                i <= stepIndex ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${
                  i <= stepIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < stepIndex ? "\u2713" : i + 1}
              </div>
              <span className="hidden sm:inline">{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`h-px w-6 ${i < stepIndex ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {step === "describe" && (
        <DescribeStep
          title={title}
          description={description}
          onDescriptionChange={setDescription}
          onNext={handleDescribeNext}
          onCancel={onCancel}
        />
      )}
      {step === "discovery" && <DiscoveryStep onComplete={handleDiscoveryComplete} />}
      {step === "repos" && (
        <RepoSelectionStep
          selectedRepos={selectedRepos}
          onSelectedReposChange={setSelectedRepos}
          planMode={planMode}
          onPlanModeChange={setPlanMode}
          onSubmit={handleSubmit}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
