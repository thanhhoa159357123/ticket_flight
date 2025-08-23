import dayjs from "dayjs";

export const parseUTCDate = (dateString) => {
  if (!dateString) return null;
  return dayjs(dateString).subtract(7, "hour");
};
