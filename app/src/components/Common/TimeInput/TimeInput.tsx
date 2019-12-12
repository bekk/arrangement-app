import React from 'react';
import { EditTime } from 'src/types/time';
import style from './TimeInput.module.scss';

interface IProps {
  label: string;
  value: EditTime;
  onChange: (value: EditTime) => void;
}

export const TimeInput = ({ label, value, onChange }: IProps): JSX.Element => {
  const hour = value[0];
  const minute = value[1];

  const updateHour = (value: string) => {
    onChange([value, minute]);
  };

  const updateMinute = (value: string) => {
    onChange([hour, value]);
  };

  return (
    <>
      <input
        className={style.timeInput}
        type="number"
        id={label}
        onChange={v => updateHour(v.target.value)}
        value={hour}
      />
      <input
        className={style.timeInput}
        type="number"
        id={label}
        onChange={v => updateMinute(v.target.value)}
        value={minute}
      />
    </>
  );
};
