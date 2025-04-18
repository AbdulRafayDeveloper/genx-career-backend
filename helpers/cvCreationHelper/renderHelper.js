export const escapeHtml = (unsafe) => {
  if (typeof unsafe !== "string") return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const renderTemplate = (template, data, prefix = "") => {
  let rendered = template;

  for (const key in data) {
    const value = data[key];

    if (typeof value === "object" && !Array.isArray(value)) {
      // Recursively process nested objects
      rendered = renderTemplate(rendered, value, `${prefix}${key}.`);
    } else {
      const rawRegex = new RegExp(`\\{\\{\\{${prefix}${key}\\}\\}\\}`, "g");
      rendered = rendered.replace(rawRegex, value ?? "");

      const regularRegex = new RegExp(`\\{\\{${prefix}${key}\\}\\}`, "g");
      rendered = rendered.replace(regularRegex, escapeHtml(value ?? ""));
    }
  }
  return rendered;
};
