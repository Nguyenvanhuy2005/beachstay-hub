
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
}

const MainLayout = ({ children, hideHeader }: MainLayoutProps) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.includes('/admin');
  const shouldHideHeader = hideHeader || isAdminRoute;

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideHeader && <Header />}
      <main className={`flex-grow ${isAdminRoute ? 'pt-0' : 'pt-16 md:pt-20'}`}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default MainLayout;
