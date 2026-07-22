export const parseNovaDate = (value) => {
  if (!value) return null;
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const withSeconds = normalized.length === 16 ? `${normalized}:00` : normalized;
  const date = new Date(withSeconds);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getLatestDate = (items, field) => {
  const dates = items
    .map((item) => parseNovaDate(item[field]))
    .filter(Boolean);
  if (!dates.length) return new Date();
  return new Date(Math.max(...dates.map((date) => date.getTime())));
};

export const filterByDatePreset = (items, field, preset, range) => {
  if (!preset || preset === "all") return items;
  if (preset === "custom" && range && range.length === 2) {
    const [start, end] = range;
    if (!start || !end) return items;
    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
    return items.filter((item) => {
      const date = parseNovaDate(item[field]);
      return date && date >= startDate && date <= endDate;
    });
  }

  const referenceDate = getLatestDate(items, field);
  if (preset === "monthly") {
    const refMonth = referenceDate.getMonth();
    const refYear = referenceDate.getFullYear();
    return items.filter((item) => {
      const date = parseNovaDate(item[field]);
      return date && date.getMonth() === refMonth && date.getFullYear() === refYear;
    });
  }

  if (preset === "weekly") {
    const refTime = referenceDate.getTime();
    const weekAgo = refTime - 7 * 24 * 60 * 60 * 1000;
    return items.filter((item) => {
      const date = parseNovaDate(item[field]);
      return date && date.getTime() >= weekAgo && date.getTime() <= refTime;
    });
  }

  return items;
};
