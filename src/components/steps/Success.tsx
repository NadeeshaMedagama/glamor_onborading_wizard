/**
 * @module components/steps/Success
 * @description Terminal success screen shown after the user submits.
 *
 * This is a one-way transition — the user cannot navigate back from it.
 * The Wizard component hides all navigation controls when this screen
 * is active.
 *
 * Includes:
 * - Animated checkmark icon with pulsing ring
 * - CSS confetti celebration
 * - Summary details (name, role, department, skill count)
 */

import { useMemo } from 'react';
import type { WizardData } from '../../types';
import './Success.css';

interface SuccessProps {
  data: WizardData;
}

const CONFETTI_COLORS = ['#7c5cfc', '#00d4aa', '#ff6b8a', '#ffb84d', '#4dd0e1', '#b388ff'];
const CONFETTI_PIECES = 24;

type ConfettiPiece = {
  left: string;
  backgroundColor: string;
  animationDelay: string;
  animationDuration: string;
  width: string;
  height: string;
};

const hashString = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const createSeededRandom = (seed: number) => {
  let value = seed % 2147483647;
  if (value <= 0) {
    value += 2147483646;
  }
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

export default function Success({ data }: SuccessProps) {
  const { personalInfo, skillsAvatar } = data;
  const confettiPieces = useMemo<ConfettiPiece[]>(() => {
    const seed = hashString(
      `${personalInfo.fullName}|${personalInfo.role}|${personalInfo.department}|${skillsAvatar.selectedSkills.length}`
    );
    const seededRandom = createSeededRandom(seed || 1);

    return Array.from({ length: CONFETTI_PIECES }, (_, i) => ({
      left: `${5 + seededRandom() * 90}%`,
      backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      animationDelay: `${seededRandom() * 1.5}s`,
      animationDuration: `${2 + seededRandom() * 2}s`,
      width: `${6 + seededRandom() * 6}px`,
      height: `${6 + seededRandom() * 6}px`,
    }));
  }, [
    personalInfo.fullName,
    personalInfo.role,
    personalInfo.department,
    skillsAvatar.selectedSkills.length,
  ]);

  return (
    <div className="success" role="status" aria-live="polite">
      {/* Confetti particles (decorative) */}
      <div className="success__confetti" aria-hidden="true">
        {confettiPieces.map((piece, i) => (
          <div
            key={i}
            className="success__confetti-piece"
            style={piece}
          />
        ))}
      </div>

      {/* Animated checkmark */}
      <div className="success__icon-ring">
        <svg
          className="success__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h2 className="success__title">Welcome Aboard!</h2>
      <p className="success__message">
        <span className="success__name">{personalInfo.fullName}</span> has been
        successfully added to the team as a{' '}
        <strong>{personalInfo.role}</strong> in the{' '}
        <strong>{personalInfo.department}</strong> department.
      </p>

      <div className="success__details">
        <div className="success__detail">
          <div className="success__detail-label">Role</div>
          <div className="success__detail-value">{personalInfo.role}</div>
        </div>
        <div className="success__detail">
          <div className="success__detail-label">Department</div>
          <div className="success__detail-value">{personalInfo.department}</div>
        </div>
        <div className="success__detail">
          <div className="success__detail-label">Skills</div>
          <div className="success__detail-value">{skillsAvatar.selectedSkills.length}</div>
        </div>
      </div>
    </div>
  );
}
