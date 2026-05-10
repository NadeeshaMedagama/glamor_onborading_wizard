/**
 * @module components/steps/Review
 * @description Step 3 — Summary screen presenting all collected data.
 *
 * Layout:
 * - Profile header (avatar + name + email)
 * - Info cards (role, department)
 * - Skills tag list
 * - "Edit" shortcuts that navigate directly to Step 1 or Step 2
 * - Submit button transitions to the terminal Success screen
 */

import type { WizardData } from '../../types';
import './Review.css';

interface ReviewProps {
  data: WizardData;
  onSubmit: () => void;
  onBack: () => void;
  onGoToStep: (step: number) => void;
}

export default function Review({ data, onSubmit, onBack, onGoToStep }: ReviewProps) {
  const { personalInfo, skillsAvatar } = data;

  return (
    <div className="review">
      <h2 className="review__title">Review & Submit</h2>
      <p className="review__subtitle">Please review the details below before submitting</p>

      {/* ── Profile Header ────────────────────────────────────────────── */}
      <div className="review__section-header">
        <span className="review__section-label">Profile</span>
        <button
          type="button"
          className="review__edit-btn"
          onClick={() => onGoToStep(1)}
          aria-label="Edit personal information"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit
        </button>
      </div>

      <div className="review__profile">
        {skillsAvatar.avatarPreviewUrl && (
          <img
            src={skillsAvatar.avatarPreviewUrl}
            alt={`${personalInfo.fullName}'s avatar`}
            className="review__avatar"
          />
        )}
        <div className="review__profile-info">
          <div className="review__name">{personalInfo.fullName}</div>
          <div className="review__email">{personalInfo.email}</div>
        </div>
      </div>

      <div className="review__cards">
        <div className="review__card">
          <div className="review__card-label">Role</div>
          <div className="review__card-value">{personalInfo.role}</div>
        </div>
        <div className="review__card">
          <div className="review__card-label">Department</div>
          <div className="review__card-value">{personalInfo.department}</div>
        </div>
      </div>

      {/* ── Skills ────────────────────────────────────────────────────── */}
      <div className="review__skills-section">
        <div className="review__section-header">
          <span className="review__section-label">Skills</span>
          <button
            type="button"
            className="review__edit-btn"
            onClick={() => onGoToStep(2)}
            aria-label="Edit skills and avatar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>
        </div>
        <div className="review__skills-list">
          {skillsAvatar.selectedSkills.map((skill) => (
            <span key={skill} className="review__skill-tag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* ── Actions ───────────────────────────────────────────────────── */}
      <div className="wizard__actions">
        <button
          type="button"
          className="wizard__btn wizard__btn--secondary"
          onClick={onBack}
          aria-label="Go back to Skills & Avatar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <button
          type="button"
          className="wizard__btn wizard__btn--submit"
          onClick={onSubmit}
          aria-label="Submit team member registration"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Submit
        </button>
      </div>
    </div>
  );
}
