import { validate, Result } from './validation';
import { format } from 'date-fns';
import { nb } from 'date-fns/esm/locale';

export type IDateContract = IDate;

export type EditDate = string;

export interface IDate {
  day: number;
  month: number;
  year: number;
}

export const parseDate = (date: EditDate): Result<EditDate, IDate> => {
  const dateISO8601 = /^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,2})/;
  const dates = date.match(dateISO8601) || [];

  const year = Number(dates[1]);
  const month = Number(dates[2]);
  const day = Number(dates[3]);

  const validator = validate<EditDate, IDate>(dates[0] || date, {
    'Trenger år, måned og dato i YYYY-MM-DD format': dates.length <= 3,
    'År må være et heltall': !Number.isInteger(year),
    'Måned må være et heltall': !Number.isInteger(month),
    'Dag må være et heltall': !Number.isInteger(day),
  });

  return validator.resolve({
    year,
    month,
    day,
  });
};

export const dateAsText = (date: IDate) => {
  return format(
    new Date(date.year, date.month - 1, date.day),
    'cccc dd. MMMM yyyy',
    { locale: nb }
  );
};

export const isSameDate = (date: IDate, otherDate: IDate) => {
  return (
    date.year === otherDate.year &&
    date.month === otherDate.month &&
    date.day === otherDate.day
  );
};

export const deserializeDate = ({
  year,
  month,
  day,
}: IDateContract): EditDate =>
  `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}`;

export const stringifyDate = ({ year, month, day }: IDate) =>
  `${day.toString().padStart(2, '0')}.${month
    .toString()
    .padStart(2, '0')}.${year}`;

export const getTodayDeserialized = () => {
  const today = new Date();
  return deserializeDate({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  });
};
