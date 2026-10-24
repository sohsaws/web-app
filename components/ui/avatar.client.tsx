import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactElement } from "react";

interface AvatarProps {
  image?: string | null;
  name: string;
}

export function Avatar({ image, name }: AvatarProps): ReactElement {
  const t = useTranslations("Common.avatar");

  return (
    <span className="relative block h-full w-full overflow-hidden rounded-full border border-neutral-800 bg-neutral-900">
      <Image
        src={image ?? "/imgs/User.png"}
        alt={t("alt", { name })}
        fill
        className="object-cover"
      />
    </span>
  );
}
