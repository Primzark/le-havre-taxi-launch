import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
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
