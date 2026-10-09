import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between max-w-xl mx-auto mb-8">
      {steps.map((label, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-semibold transition-colors ${
                  isCompleted
                    ? 'bg-status-approved text-on-accent'
                    : isCurrent
                    ? 'bg-accent text-on-accent'
                    : 'bg-surface border border-border text-muted'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : stepNum}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  isCurrent ? 'text-text' : 'text-muted'
                }`}
              >
                {label}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-px mx-4 transition-colors ${
                  stepNum < currentStep ? 'bg-status-approved' : 'bg-border'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
