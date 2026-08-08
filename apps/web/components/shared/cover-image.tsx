"use client";

import { useState } from "react";
import Image from "next/image";

export function CoverImage({
  src,
  alt,
  className,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 640px) 45vw, 160px"}
      priority={priority}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
