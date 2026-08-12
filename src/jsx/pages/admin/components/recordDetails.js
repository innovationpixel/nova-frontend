import { formatDateTime, resolveImageSrc } from "../../../../utils";

const ACRONYMS = ["id", "url", "kyc", "otp", "api", "uuid", "sms", "ip"];
const IMAGE_KEY_RE = /(pic|photo|image|avatar|logo|thumb)(_url)?$/i;
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i;
const ABSOLUTE_SRC_RE = /^((https?:)?\/\/|data:)/i;

/**
 * `identity_front_pic_url` -> `Identity Front Pic URL`
 */
export const humanizeKey = (key) =>
  String(key)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) =>
      ACRONYMS.includes(word.toLowerCase())
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");

/**
 * A field holds an image when either the key or the value says so, so document
 * scans are rendered as pictures instead of unreadable URLs.
 */
export const isImageField = (key, value) =>
  typeof value === "string" &&
  value.trim() !== "" &&
  (IMAGE_KEY_RE.test(key) || IMAGE_EXT_RE.test(value.trim()));

export const formatDetailValue = (key, value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  if (value instanceof Date) return formatDateTime(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    return value.length ? `${value.length} item(s)` : "N/A";
  }
  if (/(_at|_date|_time)$/i.test(key)) return formatDateTime(value);
  return String(value);
};

/**
 * Walk an API record so every field it returns is displayed. Nested relations
 * become their own titled group and image fields are split out for thumbnails.
 */
export const buildRecordDetails = (
  record,
  { skipKeys = [], rootTitle = "Other Fields", maxDepth = 3 } = {},
) => {
  const skip = new Set(skipKeys);
  const groups = [];
  const images = [];

  const walk = (source, path, depth) => {
    const fields = [];
    const nested = [];

    Object.entries(source || {}).forEach(([key, value]) => {
      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      ) {
        nested.push([key, value]);
        return;
      }

      if (!path && skip.has(key)) return;

      if (isImageField(key, value)) {
        images.push({
          label: humanizeKey(key),
          src: resolveImageSrc(value),
          absolute: ABSOLUTE_SRC_RE.test(String(value).trim()),
        });
        return;
      }

      fields.push({
        label: humanizeKey(key),
        value: formatDetailValue(key, value),
      });
    });

    if (fields.length) {
      groups.push({
        title: path
          ? path.split(".").map(humanizeKey).join(" › ")
          : rootTitle,
        fields,
      });
    }

    if (depth < maxDepth) {
      nested.forEach(([key, value]) =>
        walk(value, path ? `${path}.${key}` : key, depth + 1),
      );
    }
  };

  walk(record || {}, "", 0);

  // The same document key often appears both on the record and inside a nested
  // relation, one copy holding a full URL and the other a bare storage path.
  // Keep one tile per document and prefer the copy that can actually load.
  const byLabel = new Map();
  images.forEach((image) => {
    if (!image.src) return;

    const current = byLabel.get(image.label);
    if (!current || (!current.absolute && image.absolute)) {
      byLabel.set(image.label, image);
    }
  });

  return { groups, images: [...byLabel.values()] };
};

/**
 * Drop empty values and never print the same label/value twice in one view.
 * `seedPairs` carries what a hero or summary tile already shows.
 */
export const dedupeGroups = (groups, seedPairs = []) => {
  const seen = new Set(seedPairs);

  return groups
    .map((group) => ({
      ...group,
      fields: group.fields.filter((field) => {
        if (field.value === "N/A") return false;

        const pair = `${field.label}|${field.value}`;
        if (seen.has(pair)) return false;

        seen.add(pair);
        return true;
      }),
    }))
    .filter((group) => group.fields.length > 0);
};
