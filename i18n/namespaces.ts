// One JSON file per namespace and locale: messages/<locale>/<namespace>.json,
// with the namespace as its single top-level key ({ "Marketing": { ... } }).
// Separate files let several people translate different areas without
// editing the same file.
export const MESSAGE_NAMESPACES = [
  "common",
  "metadata",
  "marketing",
  "auth",
  "dashboard",
  "dive",
  "settings",
  "ideas",
  "validation",
  "apiErrors",
  "emails",
  "categories",
] as const;

export type MessageNamespace = (typeof MESSAGE_NAMESPACES)[number];
