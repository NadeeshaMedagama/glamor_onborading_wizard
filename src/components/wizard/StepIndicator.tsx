/**
 * @module components/wizard/StepIndicator
 * @description Visual progress indicator showing the current position
 * within the 3-step wizard flow.
 *
 * Renders numbered circles connected by horizontal lines.
 * - Active step: gradient fill + glow
 * - Completed steps: green with checkmark icon
 * - Future steps: muted outline
 *
 * Accessibility:
 * - Uses <nav> with aria-label for landmarks
 * - Active step is marked with aria-current="step"
 */

import './StepIndicator.css';

interface StepIndicatorProps {
  /** 1-based index of the currently active step. */
  currentStep: number;
  /** Ordered labels for each step. */
  steps: string[];
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <nav className="step-indicator" aria-label="Wizard progress">
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        let className = 'step-indicator__item';
        if (isActive) className += ' step-indicator__item--active';
        if (isCompleted) className += ' step-indicator__item--completed';

        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            <div className={className} aria-current={isActive ? 'step' : undefined}>
              <div className="step-indicator__circle" aria-hidden="true">
                {isCompleted ? (
                  <svg
                    className="step-indicator__check"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span className="step-indicator__label">{label}</span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`step-indicator__connector${isCompleted ? ' step-indicator__connector--completed' : ''}`}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
