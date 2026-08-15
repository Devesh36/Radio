"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

const FLAG = "baithak-scroll-rooms";

export function HomeLandingScroll() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    const shouldOpenCatalog = sessionStorage.getItem(FLAG) === "1";
    sessionStorage.removeItem(FLAG);

    if (shouldOpenCatalog) {
      document.getElementById("rooms-grid")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    window.scrollTo(0, 0);
  }, []);

  return null;
}

export function ScrollToRooms({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <a
      href="/"
      className={className}
      style={style}
      onClick={(event) => {
        event.preventDefault();
        const catalog = document.getElementById("rooms-grid");
        if (pathname === "/" && catalog) {
          catalog.scrollIntoView({ behavior: "smooth" });
          return;
        }
        sessionStorage.setItem(FLAG, "1");
        router.push("/");
      }}
    >
      {children}
    </a>
  );
}
