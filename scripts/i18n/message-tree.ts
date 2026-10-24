// A message file is a tree of objects with string leaves. Paths join keys
// with dots ("Settings.profile.saved"), which is safe because next-intl
// forbids dots inside keys.
export type MessageTree = { [key: string]: string | MessageTree };

export function isMessageTree(value: unknown): value is MessageTree {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  return Object.values(value).every(
    (child) => typeof child === "string" || isMessageTree(child),
  );
}

export function flattenMessages(
  tree: MessageTree,
  prefix = "",
): Map<string, string> {
  const messages = new Map<string, string>();

  for (const [key, value] of Object.entries(tree)) {
    const path = prefix === "" ? key : `${prefix}.${key}`;
    if (typeof value === "string") {
      messages.set(path, value);
    } else {
      for (const [childPath, text] of flattenMessages(value, path)) {
        messages.set(childPath, text);
      }
    }
  }

  return messages;
}

// Builds a tree with the source's shape and key order, keeping only paths
// that have a value. Matching the English order keeps diffs readable.
export function buildMessageTree(
  source: MessageTree,
  valueAt: (path: string) => string | undefined,
  prefix = "",
): MessageTree {
  const tree: MessageTree = {};

  for (const [key, value] of Object.entries(source)) {
    const path = prefix === "" ? key : `${prefix}.${key}`;
    if (typeof value === "string") {
      const text = valueAt(path);
      if (text !== undefined) {
        tree[key] = text;
      }
    } else {
      const child = buildMessageTree(value, valueAt, path);
      if (Object.keys(child).length > 0) {
        tree[key] = child;
      }
    }
  }

  return tree;
}
