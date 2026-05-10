/**
 * @module components/wizard/Wizard
 * @description Root orchestrator for the 3-step onboarding wizard.
 *
 * Responsibilities:
 * 1. Owns all form state (personalInfo + skillsAvatar)
 * 2. Manages step navigation (1 → 2 → 3 → Success)
 * 3. Detects role changes (via useRef) and clears skills when the role
 *    changes — while preserving avatar and all other data
 * 4. Enforces the terminal success state — once submitted, back navigation
 *    is impossible
 *
 * State architecture:
 * - Each step component receives its slice of state + an onChange callback
 * - Validation lives in each step component (using shared utils)
 * - The Wizard never validates — it trusts that steps only call onNext
 *   when their own validation passes
 */

import { useRef, useState } from 'react';
import type { PersonalInfoData, SkillsAvatarData, Role, WizardData } from '../../types';
import StepIndicator from './StepIndicator';
import PersonalInfo from '../steps/PersonalInfo';
import SkillsAvatar from '../steps/SkillsAvatar';
import Review from '../steps/Review';
import Success from '../steps/Success';
import './Wizard.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const STEP_LABELS = ['Personal Info', 'Skills & Avatar', 'Review'];

const INITIAL_PERSONAL_INFO: PersonalInfoData = {
  fullName: '',
  email: '',
  role: '',
  department: '',
};

const INITIAL_SKILLS_AVATAR: SkillsAvatarData = {
  avatarFile: null,
  avatarPreviewUrl: '',
  selectedSkills: [],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Wizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>(INITIAL_PERSONAL_INFO);
  const [skillsAvatar, setSkillsAvatar] = useState<SkillsAvatarData>(INITIAL_SKILLS_AVATAR);

  /**
   * Tracks the role that was active the last time the user moved to Step 2.
   * If the user goes back to Step 1, changes the role, and advances again,
   * we compare against this ref to decide whether to clear the skills.
   */
  const prevRoleRef = useRef<Role | ''>(personalInfo.role);

  const wizardData: WizardData = { personalInfo, skillsAvatar };

  // ── Navigation helpers ─────────────────────────────────────────────────

  /**
   * Navigates to a specific step, handling the role-change → skills-clear
   * rule when moving to Step 2.
   */
  const goToStep = (step: number) => {
    if (step === 2 && prevRoleRef.current !== '' && prevRoleRef.current !== personalInfo.role) {
      // Role changed — clear skills but preserve avatar
      setSkillsAvatar((prev) => ({
        ...prev,
        selectedSkills: [],
      }));
    }
    prevRoleRef.current = personalInfo.role as Role;
    setCurrentStep(step);
  };

  const handleNextFromStep1 = () => goToStep(2);
  const handleNextFromStep2 = () => setCurrentStep(3);
  const handleBackToStep1 = () => setCurrentStep(1);
  const handleBackToStep2 = () => setCurrentStep(2);
  const handleSubmit = () => setSubmitted(true);

  const handleGoToStep = (step: number) => {
    if (!submitted) goToStep(step);
  };

  // ── Render ─────────────────────────────────────────────────────────────

  // Terminal state — success screen with no navigation
  if (submitted) {
    return (
      <div className="wizard">
        <div className="wizard__card">
          <div className="wizard__brand">
            <span className="wizard__brand-name">Team Onboarding</span>
          </div>
          <Success data={wizardData} />
        </div>
      </div>
    );
  }

  return (
    <div className="wizard">
      <div className="wizard__card">
        <div className="wizard__brand">
          <span className="wizard__brand-name">Team Onboarding</span>
        </div>

        <StepIndicator currentStep={currentStep} steps={STEP_LABELS} />

        {currentStep === 1 && (
          <PersonalInfo
            data={personalInfo}
            onChange={setPersonalInfo}
            onNext={handleNextFromStep1}
          />
        )}

        {currentStep === 2 && personalInfo.role && (
          <SkillsAvatar
            data={skillsAvatar}
            role={personalInfo.role as Role}
            onChange={setSkillsAvatar}
            onNext={handleNextFromStep2}
            onBack={handleBackToStep1}
          />
        )}

        {currentStep === 3 && (
          <Review
            data={wizardData}
            onSubmit={handleSubmit}
            onBack={handleBackToStep2}
            onGoToStep={handleGoToStep}
          />
        )}
      </div>
    </div>
  );
}
