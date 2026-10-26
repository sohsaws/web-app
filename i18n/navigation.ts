import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware replacements for next/link and next/navigation: hrefs are
// written without the locale ("/about") and get the current one added.
const navigation = createNavigation(routing);

export const { Link, usePathname, useRouter, getPathname } = navigation;

// The explicit type makes TypeScript treat a call as never returning, like
// next/navigation's redirect, so `if (!session) redirect(...)` narrows
// `session` afterwards. A destructured binding would not.
export const redirect: typeof navigation.redirect = navigation.redirect;
