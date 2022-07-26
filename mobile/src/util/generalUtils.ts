import moment, { Moment } from "moment";

export const isNumeric = (s: string) => {
  return !isNaN(Number(s));
};
export const generateUUID = () => {
  let dt = new Date().getTime();
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
};

export const addDaysFromToday = (daysToAdd: number) => {
  return addDays(new Date(Date.now()), daysToAdd);
};

export const addDays = (from: Date, daysToAdd: number) => {
  const result = new Date(from);
  result.setDate(result.getDate() + daysToAdd);
  return result;
};

export const minutesToHoursMinutesFun = (
  minutes: number | null,
  format: number | undefined = 0
) => {
  if (minutes === null) return;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (format === 0) {
    return `${h}h ${m}m`;
  }
  if (format === 1) {
    let hFormatted = h.toString();
    if (h.toString().length === 1) {
      hFormatted = `0${h}`;
    }
    let mFormatted = m.toString();
    if (m.toString().length === 1) {
      mFormatted = `0${m}`;
    }
    return `${hFormatted}:${mFormatted}`;
  }
};

export const formatCalendarDay = (date: Date | string | Moment) => {
  const res = moment(date).format("YYYY-MM-DD");
  return res;
};
