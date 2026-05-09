/**
 * @module components/steps/PersonalInfo
 * @description Step 1 — Collects the new team member's personal information.
 *
 * Fields: Full Name, Email, Role, Department — all required.
 *
 * Validation strategy:
 * - On blur: validates the touched field immediately
 * - On change: if the field was already touched, re-validates in real-time
 * - On "Next" click: validates all fields, shows all errors, marks all as touched
 * - The Next button gets a visual "disabled" style when the form is invalid,
 *   but remains clickable so that clicking it triggers validation messages.
 */

import { useState } from 'react';
import type { PersonalInfoData, Role, Department, ValidationErrors } from '../../types';
import { ROLES, DEPARTMENTS } from '../../constants/skills';
import { validatePersonalInfo } from '../../utils/validation';
import ErrorMessage from '../ui/ErrorMessage';
import './PersonalInfo.css';

interface PersonalInfoProps {
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
  onNext: () => void;
}

export default function PersonalInfo({ data, onChange, onNext }: PersonalInfoProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (field: keyof PersonalInfoData, value: string) => {
    const updated = { ...data, [field]: value };
    onChange(updated);

    // Re-validate on change if the field has already been touched
    if (touched[field]) {
      const fieldErrors = validatePersonalInfo(updated);
      setErrors((prev) => ({
        ...prev,
        [field]: fieldErrors[field] || '',
      }));
    }
  };

  const handleBlur = (field: keyof PersonalInfoData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validatePersonalInfo(data);
    setErrors((prev) => ({
      ...prev,
      [field]: fieldErrors[field] || '',
    }));
  };

  const handleSubmit = () => {
    const allErrors = validatePersonalInfo(data);
    setErrors(allErrors);
    setTouched({ fullName: true, email: true, role: true, department: true });

    if (Object.keys(allErrors).length === 0) {
      onNext();
    }
  };

  const isFormValid = Object.keys(validatePersonalInfo(data)).length === 0;

  return (
    <div className="personal-info">
      <h2 className="personal-info__title">Personal Information</h2>
      <p className="personal-info__subtitle">Tell us about the new team member</p>

      {/* Full Name */}
      <div className="form-group">
        <label htmlFor="fullName" className="form-group__label form-group__label--required">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          className={`form-group__input${errors.fullName ? ' form-group__input--error' : ''}`}
          placeholder="e.g. Jane Doe"
          value={data.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          onBlur={() => handleBlur('fullName')}
          aria-required="true"
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          autoComplete="name"
        />
        {errors.fullName && <ErrorMessage id="fullName-error" message={errors.fullName} />}
      </div>

      {/* Email */}
      <div className="form-group">
        <label htmlFor="email" className="form-group__label form-group__label--required">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          className={`form-group__input${errors.email ? ' form-group__input--error' : ''}`}
          placeholder="e.g. jane@company.com"
          value={data.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          autoComplete="email"
        />
        {errors.email && <ErrorMessage id="email-error" message={errors.email} />}
      </div>

      {/* Role & Department — side by side */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="role" className="form-group__label form-group__label--required">
            Role
          </label>
          <div className="form-group__select-wrapper">
            <select
              id="role"
              className={`form-group__select${errors.role ? ' form-group__select--error' : ''}`}
              value={data.role}
              onChange={(e) => handleChange('role', e.target.value as Role)}
              onBlur={() => handleBlur('role')}
              aria-required="true"
              aria-invalid={!!errors.role}
              aria-describedby={errors.role ? 'role-error' : undefined}
            >
              <option value="" disabled>Select a role</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          {errors.role && <ErrorMessage id="role-error" message={errors.role} />}
        </div>

        <div className="form-group">
          <label htmlFor="department" className="form-group__label form-group__label--required">
            Department
          </label>
          <div className="form-group__select-wrapper">
            <select
              id="department"
              className={`form-group__select${errors.department ? ' form-group__select--error' : ''}`}
              value={data.department}
              onChange={(e) => handleChange('department', e.target.value as Department)}
              onBlur={() => handleBlur('department')}
              aria-required="true"
              aria-invalid={!!errors.department}
              aria-describedby={errors.department ? 'department-error' : undefined}
            >
              <option value="" disabled>Select a department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          {errors.department && <ErrorMessage id="department-error" message={errors.department} />}
        </div>
      </div>

      {/* Actions */}
      <div className="wizard__actions">
        <div />
        <button
          type="button"
          className={`wizard__btn wizard__btn--primary${!isFormValid ? ' wizard__btn--disabled' : ''}`}
          onClick={handleSubmit}
          aria-label="Continue to Skills & Avatar"
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
