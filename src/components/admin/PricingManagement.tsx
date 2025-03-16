
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const PricingManagement = () => {
  const { language } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'vi' ? 'Quản lý giá phòng' : 'Pricing Management'}
        </CardTitle>
        <CardDescription>
          {language === 'vi' 
            ? 'Quản lý giá phòng theo thời gian, mùa, dịp lễ' 
            : 'Manage room rates by time, season, and holidays'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {language === 'vi' 
            ? 'Tính năng này đang được phát triển.' 
            : 'This feature is under development.'}
        </p>
      </CardContent>
    </Card>
  );
};

export default PricingManagement;
