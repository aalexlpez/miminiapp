import { useState, type ReactNode } from 'react';

/** The selected value remains plain text; visual choice mode never enters v1. */
export default function PhraseChoices({
  name,
  label,
  values,
  value,
  customLabel,
  error,
  onChange,
  children,
}: {
  name: string;
  label: string;
  values: readonly string[];
  value: string;
  customLabel: string;
  error?: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  const [custom, setCustom] = useState(
    () => !!value && !values.includes(value),
  );
  return (
    <fieldset
      className="pb-phrase-options"
      aria-describedby={
        error && !custom ? `pb-choice-error-${name}` : undefined
      }
    >
      <legend className="pb-sr-only">{label}</legend>
      {values.map((option) => (
        <label key={option} className="pb-choice">
          <input
            type="radio"
            name={`choice-${name}`}
            checked={!custom && value === option}
            onChange={() => {
              setCustom(false);
              onChange(option);
            }}
          />
          <span>{option}</span>
        </label>
      ))}
      <label className="pb-choice pb-custom-choice">
        <input
          type="radio"
          name={`choice-${name}`}
          checked={custom}
          onChange={() => setCustom(true)}
          aria-controls={`pb-custom-${name}`}
        />
        <span>{customLabel}</span>
      </label>
      {error && !custom && (
        <p role="alert" id={`pb-choice-error-${name}`} className="pb-error">
          {error}
        </p>
      )}
      {custom && (
        <div id={`pb-custom-${name}`} className="pb-reveal">
          {children}
        </div>
      )}
    </fieldset>
  );
}
