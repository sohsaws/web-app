import { notFound } from "next/navigation";

// Any unknown path under a locale ("/en/missing") lands here, so the
// localized app/[locale]/not-found.tsx renders inside the root layout.
export default function CatchAllPage(): never {
  notFound();
}
