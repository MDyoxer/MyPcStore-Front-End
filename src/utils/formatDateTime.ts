const padTime = (value: number) => String(value).padStart(2, "0");

export const formatDateTime = (
  value?: string | number | Date | null,
  fallback = "Sin fecha",
) => {
  if (!value) {
    return fallback;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  const day = padTime(date.getDate());
  const month = padTime(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = padTime(date.getHours());
  const minutes = padTime(date.getMinutes());
  const seconds = padTime(date.getSeconds());

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};
