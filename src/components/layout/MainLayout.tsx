
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
  const isAdminLoginRoute = location.pathname === '/admin/login';
  const isAdminRoute = location.pathname.includes('/admin') && !isAdminLoginRoute;
  const shouldHideHeader = hideHeader || isAdminRoute;

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideHeader && <Header />}
      <main className="">
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default MainLayout;
