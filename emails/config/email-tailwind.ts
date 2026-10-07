import { Tailwind } from "@react-email/components";
import type { ComponentProps } from "react";

type EmailTailwindConfig = NonNullable<
  ComponentProps<typeof Tailwind>["config"]
>;

export const emailTailwindConfig = {
  theme: {
    extend: {
      colors: {
        bg: "#ffffff",
        "bg-2": "#f3f4f6",
        fg: "#17191f",
        "fg-2": "#363a44",
        "fg-3": "#7a7f89",
        "fg-inverted": "#ffffff",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
        serif: ["Georgia", "Times New Roman", "serif"],
      },
      fontSize: {
        11: ["11px", { lineHeight: "16px" }],
        13: ["13px", { lineHeight: "20px" }],
        16: ["16px", { lineHeight: "26px" }],
        20: ["20px", { lineHeight: "28px" }],
        24: ["24px", { lineHeight: "48px" }],
        28: ["28px", { lineHeight: "36px" }],
      },
      screens: {
        mobile: { max: "480px" },
      },
    },
  },
} satisfies EmailTailwindConfig;
