import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const scrollRevealBlockedPrefixes = ["/services", "/contact", "/actus"] as const;

const scrollRevealAllowedExactPaths = new Set([
  "/",
  "/entreprise",
  "/devenir-taxi",
  "/tarifs",
  "/mentions-legales",
  "/politique-confidentialite",
  "/liens",
]);

const scrollRevealAllowedPrefixes = ["/circuits-touristiques"] as const;

const isScrollRevealSafePath = (pathname: string): boolean => {
  if (scrollRevealBlockedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return false;
  }

  return (
    scrollRevealAllowedExactPaths.has(pathname)
    || scrollRevealAllowedPrefixes.some((prefix) => pathname.startsWith(prefix))
  );
};

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    const main = document.getElementById("main-content");
    if (!main) {
      return;
    }

    const targets = Array.from(main.querySelectorAll<HTMLElement>("section")).slice(1);
    if (targets.length === 0) {
      return;
    }

    const cleanupTargets = () => {
      targets.forEach((target) => {
        target.classList.remove("scroll-reveal");
        target.classList.remove("is-visible");
        target.style.removeProperty("--reveal-delay");
      });
    };

    if (!isScrollRevealSafePath(pathname)) {
      cleanupTargets();
      return;
    }

    const largeSectionLimit = window.innerHeight * 1.2;
    const targetsToObserve: HTMLElement[] = [];

    targets.forEach((target, index) => {
      target.classList.add("scroll-reveal");
      target.style.setProperty("--reveal-delay", `${Math.min((index % 3) * 90, 180)}ms`);

      if (target.scrollHeight > largeSectionLimit) {
        target.classList.add("is-visible");
        return;
      }

      targetsToObserve.push(target);
    });

    if (targetsToObserve.length === 0) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      targetsToObserve.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const target = entry.target as HTMLElement;
          target.classList.add("is-visible");
          observer.unobserve(target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -4% 0px",
      },
    );

    targetsToObserve.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      cleanupTargets();
    };
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] rounded bg-primary px-3 py-2 text-sm text-primary-foreground"
      >
        Aller au contenu
      </a>
      <Header />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
