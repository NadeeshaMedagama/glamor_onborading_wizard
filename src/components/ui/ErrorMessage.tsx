/**
 * @module components/ui/ErrorMessage
 * @description Reusable inline error message with icon.
 *
 * Used across all wizard steps to display field-level validation errors.
 * The message is announced to screen readers via role="alert".
 */

import './ErrorMessage.css';

interface ErrorMessageProps {
  /** Unique ID used for aria-describedby linking to the errored field. */
  id: string;
  /** Human-readable error text. */
  message: string;
}

export default function ErrorMessage({ id, message }: ErrorMessageProps) {
  return (
    <p className="error-message" id={id} role="alert">
      <svg
        className="error-message__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {message}
    </p>
  );
}
