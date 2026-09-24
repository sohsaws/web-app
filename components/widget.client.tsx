"use client";

import type { ReactElement, ReactNode } from "react";

interface WidgetProps {
  children: ReactNode;
  className?: string;
}

export function Widget({
  children,
  className = "",
}: WidgetProps): ReactElement {
  return <div className={`app-widget ${className}`}>{children}</div>;
}
