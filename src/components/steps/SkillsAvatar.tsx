/**
 * @module components/steps/SkillsAvatar
 * @description Step 2 — Avatar upload and role-based skill selection.
 *
 * Avatar upload:
 * - Accepts .jpg, .jpeg, .png only (max 3 MB)
 * - Validates type → size before showing the preview
 * - Preview uses URL.createObjectURL (client-only, no server upload)
 * - Revokes the previous object URL on re-upload to prevent memory leaks
 *
 * Skills:
 * - Chips are rendered dynamically based on the Role chosen in Step 1
 * - Each chip toggles on click with a checkmark for visual distinction
 * - Minimum 2 skills required to advance
 *
 * Back navigation preserves all entered data.
 * If the user changes their role on Step 1, only skills are cleared
 * (handled by the parent Wizard component).
 */

import { useRef, useState } from 'react';
import type { SkillsAvatarData, Role, ValidationErrors } from '../../types';
import { ROLE_SKILLS, MIN_SKILLS_REQUIRED } from '../../constants/skills';
import { validateAvatarFile, validateSkillsAvatar } from '../../utils/validation';
import ErrorMessage from '../ui/ErrorMessage';
import './SkillsAvatar.css';

interface SkillsAvatarProps {
  data: SkillsAvatarData;
  role: Role;
  onChange: (data: SkillsAvatarData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SkillsAvatar({ data, role, onChange, onNext, onBack }: SkillsAvatarProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [avatarError, setAvatarError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableSkills = ROLE_SKILLS[role] || [];

  // ── File handling ──────────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate before preview — reject invalid files immediately
    const fileError = validateAvatarFile(file);
    if (fileError) {
      setAvatarError(fileError);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Valid file — clear errors, revoke old URL to prevent memory leak
    setAvatarError('');
    setErrors((prev) => ({ ...prev, avatar: '' }));

    if (data.avatarPreviewUrl) {
      URL.revokeObjectURL(data.avatarPreviewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    onChange({
      ...data,
      avatarFile: file,
      avatarPreviewUrl: previewUrl,
    });
  };

  // ── Skill toggling ────────────────────────────────────────────────────

  const toggleSkill = (skill: string) => {
    const isSelected = data.selectedSkills.includes(skill);
    const updated = isSelected
      ? data.selectedSkills.filter((s) => s !== skill)
      : [...data.selectedSkills, skill];

    onChange({ ...data, selectedSkills: updated });

    // Live-clear the error once minimum is met
    if (updated.length >= MIN_SKILLS_REQUIRED) {
      setErrors((prev) => ({ ...prev, skills: '' }));
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────

  const handleSubmit = () => {
    const newErrors = validateSkillsAvatar(data);
    if (avatarError) {
      newErrors.avatar = avatarError;
    }
    setErrors(newErrors);

    if (Object.values(newErrors).every((e) => !e) && !avatarError) {
      onNext();
    }
  };

  return (
    <div className="skills-avatar">
      <h2 className="skills-avatar__title">Skills & Avatar</h2>
      <p className="skills-avatar__subtitle">Upload a photo and select your expertise</p>

      {/* ── Avatar Upload ─────────────────────────────────────────────── */}
      <div className="avatar-section">
        <span className="avatar-section__label avatar-section__label--required">
          Profile Photo
        </span>
        <div className="avatar-upload">
          <div className={`avatar-preview${data.avatarPreviewUrl ? ' avatar-preview--has-image' : ''}`}>
            {data.avatarPreviewUrl ? (
              <img
                src={data.avatarPreviewUrl}
                alt="Avatar preview"
                className="avatar-preview__image"
              />
            ) : (
              <svg
                className="avatar-preview__placeholder"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>

          <div className="avatar-upload__controls">
            <button
              type="button"
              className="avatar-upload__btn"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload profile photo"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              {data.avatarFile ? 'Change Photo' : 'Upload Photo'}
            </button>
            <span className="avatar-upload__hint">JPG or PNG, max 3 MB</span>
            <input
              ref={fileInputRef}
              type="file"
              className="avatar-upload__input"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              aria-label="Choose profile photo file"
              id="avatar-upload-input"
            />
          </div>
        </div>

        {(avatarError || errors.avatar) && (
          <ErrorMessage id="avatar-error" message={avatarError || errors.avatar} />
        )}
      </div>

      {/* ── Skills Selection ──────────────────────────────────────────── */}
      <div className="skills-section">
        <span className="skills-section__title skills-section__title--required">
          Skills — {role}
        </span>
        <div className="skills-grid" role="group" aria-label={`Skills for ${role}`}>
          {availableSkills.map((skill) => {
            const isSelected = data.selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                className={`skill-chip${isSelected ? ' skill-chip--selected' : ''}`}
                onClick={() => toggleSkill(skill)}
                aria-pressed={isSelected}
                aria-label={`${skill}${isSelected ? ' (selected)' : ''}`}
              >
                {isSelected && (
                  <svg className="skill-chip__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {skill}
              </button>
            );
          })}
        </div>

        <p className="skills-section__count">
          <span>{data.selectedSkills.length}</span> of {availableSkills.length} selected
          (minimum {MIN_SKILLS_REQUIRED})
        </p>

        {errors.skills && <ErrorMessage id="skills-error" message={errors.skills} />}
      </div>

      {/* ── Actions ───────────────────────────────────────────────────── */}
      <div className="wizard__actions">
        <button
          type="button"
          className="wizard__btn wizard__btn--secondary"
          onClick={onBack}
          aria-label="Go back to Personal Info"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <button
          type="button"
          className="wizard__btn wizard__btn--primary"
          onClick={handleSubmit}
          aria-label="Continue to Review"
        >
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
