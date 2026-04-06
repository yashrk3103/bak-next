"use client";

import Link from "next/link";
import { useRegion } from "@/components/layout/RegionContext";
import { getEmail } from "@/lib/constants";

interface EmailLinkProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function EmailLink({ className, style }: EmailLinkProps) {
  const { region } = useRegion();
  const email = getEmail(region);
  return (
    <Link href={`mailto:${email}`} className={className} style={style}>
      {email}
    </Link>
  );
}
