import Image from "next/image";
import type { ReactElement } from "react";

interface AvatarProps {
  image?: string | null;
  name: string;
}

export function Avatar({ image, name }: AvatarProps): ReactElement {
  return (
    <span className="relative block h-full w-full overflow-hidden rounded-full border border-neutral-800 bg-neutral-900">
      <Image
        src={image ?? "/imgs/User.png"}
        alt={`${name}'s profile picture`}
        fill
        className="object-cover"
      />
    </span>
  );
}
