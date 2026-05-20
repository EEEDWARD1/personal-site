"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ScrollGlowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const link = linkRef.current;
    if (!link) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        if (entry.isIntersecting) {
          timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
          }, 500);
          return;
        }

        setIsVisible(false);
      },
      { threshold: 0.65 },
    );

    observer.observe(link);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      observer.disconnect();
    };
  }, []);

  return (
    <Link
      ref={linkRef}
      href={href}
      className={`${className} cta-scroll-glow ${
        isVisible ? "is-scroll-glowing" : ""
      }`}
    >
      {children}
    </Link>
  );
}
