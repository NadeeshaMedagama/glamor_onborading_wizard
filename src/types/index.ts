/**
 * @module types
 * @description Core type definitions for the Team Onboarding Wizard.
 *
 * This module defines all TypeScript interfaces and type aliases used
 * throughout the application — including form data shapes, role/department
 * enums, and validation error maps.
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

/** Available team roles that determine which skills are presented in Step 2. */
export type Role = 'Designer' | 'Developer' | 'QA Engineer' | 'Project Manager';

/** Organisational departments a new team member can be assigned to. */
export type Department = 'Engineering' | 'Design' | 'Delivery' | 'Operations';

// ─── Form Data ────────────────────────────────────────────────────────────────

/** Data collected during Step 1 — Personal Information. */
export interface PersonalInfoData {
  fullName: string;
  email: string;
  role: Role | '';
  department: Department | '';
}

/** Data collected during Step 2 — Skills & Avatar. */
export interface SkillsAvatarData {
  /** The raw File object selected by the user (null until a valid file is chosen). */
  avatarFile: File | null;
  /** Object URL created via URL.createObjectURL for the circular preview. */
  avatarPreviewUrl: string;
  /** Array of skill names the user has toggled on. */
  selectedSkills: string[];
}

/** Aggregated wizard data passed to the Review and Success screens. */
export interface WizardData {
  personalInfo: PersonalInfoData;
  skillsAvatar: SkillsAvatarData;
}

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * A map of field names → error messages.
 * An empty string or missing key means the field is valid.
 */
export interface ValidationErrors {
  [key: string]: string;
}
