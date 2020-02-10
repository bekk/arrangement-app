import React from 'react';
import style from './TextInput.module.scss';

interface IProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onBlur?: () => void;
}

export const TextInput = ({
  label,
  value,
  onChange,
  placeholder = '',
  onBlur = () => undefined,
}: IProps): JSX.Element => {
  return (
    <>
      <label className={style.textLabel} htmlFor={label}>
        {label}
      </label>
      <input
        type="text"
        className={style.textInput}
        placeholder={placeholder}
        value={value}
        onChange={v => onChange(v.target.value)}
        onBlur={onBlur}
      />
    </>
  );
};
