import React from 'react';
import { Result } from 'src/types/validation';
import { useState } from 'react';
import { ValidationResult } from '../ValidationResult/ValidationResult';
import { TextInput } from '../TextInput/TextInput';

interface ValidTextInputProps {
  label: string;
  placeholder?: string;
  value: Result<string, any>;
  onChange: (value: string) => void;
}

export const ValidatedTextInput = ({
  label,
  placeholder,
  value,
  onChange,
}: ValidTextInputProps) => {
  const [showErrors, setShowErrors] = useState(false);
  return (
    <>
      <TextInput
        label={label}
        placeholder={placeholder}
        value={value.editValue}
        onChange={onChange}
        isError={showErrors && Boolean(value.errors)}
        onBlur={() => setShowErrors(true)}
      />
      {showErrors && <ValidationResult validationResult={value.errors} />}
    </>
  );
};
