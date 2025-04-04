
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet";
import MainLayout from "@/components/layout/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <Helmet>
        <title>
          {language === "vi" ? "Không tìm thấy trang | Annam Village" : "Page Not Found | Annam Village"}
        </title>
        <meta 
          name="description" 
          content={language === "vi" 
            ? "Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển." 
            : "The page you are looking for doesn't exist or has been moved."} 
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <div className="container mx-auto py-24 md:py-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-6xl font-sans font-bold text-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            404
          </motion.h1>
          
          <motion.h2 
            className="text-3xl font-sans font-semibold text-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {language === "vi" ? "Không Tìm Thấy Trang" : "Page Not Found"}
          </motion.h2>
          
          <motion.p 
            className="text-lg text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {language === "vi" 
              ? "Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển."
              : "The page you are looking for doesn't exist or has been moved."}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button asChild className="bg-primary hover:bg-green-800">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {language === "vi" ? "Quay Lại Trang Chủ" : "Back to Home"}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
