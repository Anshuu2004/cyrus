/* ══ router.tsx — react-router compat surface over next/navigation
   Pages were ported from the Vite SPA; this shim lets them keep their
   imports (Link to=, useNavigate, useParams, useLocation, useSearchParams)
   while the app runs on the Next.js App Router. ═══════════════════════ */
"use client";

import NextLink from "next/link";
import { usePathname, useRouter, useParams as useNextParams } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type LinkProps = {
  to: string;
  children?: ReactNode;
  className?: string;
  end?: boolean;
  onClick?: () => void;
  title?: string;
  "aria-label"?: string;
  style?: React.CSSProperties;
};

export function Link({ to, children, end: _end, ...rest }: LinkProps) {
  return (
    <NextLink href={to} {...rest}>
      {children}
    </NextLink>
  );
}

/* Nav.tsx passes plain className strings and computes active state itself,
   so NavLink only needs to render a link and forward the click handler. */
export const NavLink = Link;

export function useNavigate() {
  const router = useRouter();
  return (to: string | number) => {
    if (typeof to === "number") {
      if (to < 0) router.back();
      else router.forward();
      return;
    }
    router.push(to);
  };
}

export function useParams<_T extends Record<string, string> = Record<string, string>>() {
  return useNextParams() as unknown as _T;
}

/* Search + hash come from window.location, not next/navigation:
   useSearchParams() in the shared layout breaks static prerendering
   (Next requires a Suspense boundary), and these pages only read the
   query at mount or update it via full client navigations anyway. */
function useWindowLocation() {
  const pathname = usePathname() ?? "";
  const [loc, setLoc] = useState({ search: "", hash: "" });
  useEffect(() => {
    const read = () => setLoc({ search: window.location.search, hash: window.location.hash });
    read();
    window.addEventListener("popstate", read);
    window.addEventListener("hashchange", read);
    return () => {
      window.removeEventListener("popstate", read);
      window.removeEventListener("hashchange", read);
    };
  }, [pathname]);
  return { pathname, ...loc };
}

export function useLocation() {
  return useWindowLocation();
}

export function useSearchParams(): [URLSearchParams, (next: URLSearchParams | Record<string, string>) => void] {
  const { search } = useWindowLocation();
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const set = (next: URLSearchParams | Record<string, string>) => {
    const qs = (next instanceof URLSearchParams ? next : new URLSearchParams(next)).toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  return [params, set];
}
