/**
 * @module utils/validation
 * @description Pure validation functions used across wizard steps.
 *
 * All validators return a ValidationErrors object:
 * - Empty object → all fields are valid
 * - Populated keys → the corresponding field has an error
 *
 * These functions are intentionally pure (no side effects) so they
 * can be unit-tested in isolation.
 */

import type { PersonalInfoData, SkillsAvatarData, ValidationErrors } from '../types';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_AVATAR_SIZE_BYTES,
  MAX_AVATAR_SIZE_LABEL,
  MIN_SKILLS_REQUIRED,
} from '../constants/skills';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** RFC-5322-lite email format check. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Step 1: Personal Info ────────────────────────────────────────────────────

/**
 * Validates all fields for the Personal Information step.
 * Returns an empty object when every field is valid.
 */
export function validatePersonalInfo(data: PersonalInfoData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.fullName.trim()) {
    errors.fullName = 'Full name is required';
  }

  if (!data.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.role) {
    errors.role = 'Please select a role';
  }

  if (!data.department) {
    errors.department = 'Please select a department';
  }

  return errors;
}

// ─── Step 2: Avatar File ──────────────────────────────────────────────────────

/**
 * Validates an avatar file before it is previewed.
 * Returns null when the file is valid, or an error string otherwise.
 *
 * Validation order matters:
 * 1. File type is checked first
 * 2. File size is checked second
 * The preview must NOT appear for invalid files.
 */
export function validateAvatarFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Only .jpg, .jpeg, and .png files are accepted';
  }

  if (file.size > MAX_AVATAR_SIZE_BYTES) {
    return `File size must be under ${MAX_AVATAR_SIZE_LABEL}`;
  }

  return null; // valid
}

// ─── Step 2: Skills & Avatar (combined) ───────────────────────────────────────

/**
 * Validates the complete Step 2 data (avatar + skills).
 */
export function validateSkillsAvatar(data: SkillsAvatarData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.avatarFile) {
    errors.avatar = 'Please upload a profile photo';
  }

  if (data.selectedSkills.length < MIN_SKILLS_REQUIRED) {
    errors.skills = `Please select at least ${MIN_SKILLS_REQUIRED} skills`;
  }

  return errors;
}
