export const timedelta = ({
  days = 0,
  seconds = 0,
  milliseconds = 0,
  minutes = 0,
  hours = 0,
  weeks = 0,
} = {}) => {
  const MILLISECOND = 1;
  const SECOND = MILLISECOND * 1000;
  const MINUTE = SECOND * 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;
  const WEEK = DAY * 7;

  return [
    milliseconds * MILLISECOND,
    seconds * SECOND,
    minutes * MINUTE,
    hours * HOUR,
    days * DAY,
    weeks * WEEK,
  ].reduce((total, ms) => total + ms);
};
