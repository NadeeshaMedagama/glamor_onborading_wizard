/**
 * @module constants/skills
 * @description Role-to-skill mapping for the Skills & Avatar step.
 *
 * Each role presents a distinct set of selectable skill chips.
 * When the user changes their role in Step 1, the wizard clears
 * any previously selected skills (since the options have changed)
 * while preserving the uploaded avatar and other state.
 */

import type { Role } from '../types';

/**
 * Maps each Role to an ordered array of skill labels.
 * The order here determines the display order in the chip grid.
 */
export const ROLE_SKILLS: Record<Role, string[]> = {
  Designer: [
    'Figma',
    'Prototyping',
    'User Research',
    'Illustration',
    'Motion',
    'Design Systems',
    'Accessibility',
  ],
  Developer: [
    'React',
    'TypeScript',
    'Node.js',
    'NestJS',
    'PostgreSQL',
    'REST APIs',
    'Testing',
    'Docker',
  ],
  'QA Engineer': [
    'Manual Testing',
    'Automation',
    'Playwright',
    'Test Planning',
    'API Testing',
    'Bug Reporting',
  ],
  'Project Manager': [
    'Agile',
    'Scrum',
    'Risk Management',
    'Stakeholder Comms',
    'Estimation',
    'Jira',
    'Budgeting',
  ],
};

/** All available roles, in display order. */
export const ROLES: Role[] = ['Designer', 'Developer', 'QA Engineer', 'Project Manager'];

/** All available departments, in display order. */
export const DEPARTMENTS = ['Engineering', 'Design', 'Delivery', 'Operations'] as const;

/** Accepted MIME types for avatar upload. */
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

/** Maximum avatar file size in bytes (3 MB). */
export const MAX_AVATAR_SIZE_BYTES = 3 * 1024 * 1024;

/** Human-readable max size label. */
export const MAX_AVATAR_SIZE_LABEL = '3 MB';

/** Minimum number of skills that must be selected before advancing. */
export const MIN_SKILLS_REQUIRED = 2;
