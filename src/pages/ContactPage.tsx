import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ContactPage = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: language === 'vi' ? 'Vui lòng điền đầy đủ thông tin' : 'Please fill in all required fields',
        description: language === 'vi' ? 'Tên, email và tin nhắn là bắt buộc' : 'Name, email, and message are required',
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      
      toast({
        title: language === 'vi' ? 'Gửi thành công!' : 'Sent Successfully!',
        description: language === 'vi' ? 'Chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể.' : 'We will get back to you as soon as possible.',
      });
      
      setLoading(false);
    }, 1500);
  };
  
  const contactDetails = [
    {
      icon: <Phone className="h-5 w-5 text-beach-600" />,
      title: language === 'vi' ? 'Điện Thoại' : 'Phone',
      details: ['+84 (0) 254 123 4567', '+84 (0) 917 345 678'],
    },
    {
      icon: <Mail className="h-5 w-5 text-beach-600" />,
      title: language === 'vi' ? 'Email' : 'Email',
      details: ['info@annamvillage.vn', 'booking@annamvillage.vn'],
    },
    {
      icon: <MapPin className="h-5 w-5 text-beach-600" />,
      title: language === 'vi' ? 'Địa Chỉ' : 'Address',
      details: [language === 'vi' 
        ? '26 Trần Phú, Phường 1, Thành phố Vũng Tàu, Bà Rịa - Vũng Tàu, Việt Nam'
        : '26 Tran Phu, Ward 1, Vung Tau City, Ba Ria - Vung Tau, Vietnam'],
    },
    {
      icon: <Clock className="h-5 w-5 text-beach-600" />,
      title: language === 'vi' ? 'Giờ Làm Việc' : 'Working Hours',
      details: [
        language === 'vi' ? 'Thứ Hai - Chủ Nhật: 24/7' : 'Monday - Sunday: 24/7',
        language === 'vi' ? 'Lễ Tân: Phục vụ 24/7' : 'Reception: 24/7 service'
      ],
    },
  ];
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative bg-beach-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-beach-900/80 to-beach-800/90 z-10"></div>
          <img 
            src="/lovable-uploads/570e7af9-b072-46c1-a4b0-b982c09d1df4.png" 
            alt="Contact Us" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 py-20 md:py-32">
          <motion.h1 
            className="font-serif text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {language === 'vi' ? 'Liên Hệ' : 'Contact Us'}
          </motion.h1>
          <motion.p 
            className="text-beach-100 max-w-3xl text-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {language === 'vi' 
              ? 'Hãy liên hệ với chúng tôi nếu bạn cần hỗ trợ hoặc có bất kỳ câu hỏi nào. Đội ngũ của chúng tôi luôn sẵn sàng phục vụ bạn.'
              : 'Contact us if you need support or have any questions. Our team is always ready to serve you.'}
          </motion.p>
        </div>
      </div>
      
      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <motion.h2
                className="font-serif text-2xl font-bold mb-6 text-beach-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {language === 'vi' ? 'Thông Tin Liên Hệ' : 'Contact Information'}
              </motion.h2>
              
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {contactDetails.map((contact, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{contact.icon}</div>
                        <div>
                          <h3 className="font-bold text-beach-900 mb-2">{contact.title}</h3>
                          <div className="space-y-1">
                            {contact.details.map((detail, i) => (
                              <p key={i} className="text-beach-700">{detail}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </div>
            
            {/* Contact Form */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-2xl font-bold mb-6 text-beach-900">
                {language === 'vi' ? 'Gửi Tin Nhắn' : 'Send a Message'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-beach-800">
                      {language === 'vi' ? 'Họ và Tên' : 'Full Name'} *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder={language === 'vi' ? 'Nhập họ và tên của bạn' : 'Enter your full name'}
                      value={formData.name}
                      onChange={handleChange}
                      className="border-beach-200 focus:border-beach-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-beach-800">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder={language === 'vi' ? 'Nhập email của bạn' : 'Enter your email'}
                      value={formData.email}
                      onChange={handleChange}
                      className="border-beach-200 focus:border-beach-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-beach-800">
                      {language === 'vi' ? 'Số Điện Thoại' : 'Phone Number'}
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder={language === 'vi' ? 'Nhập số điện thoại của bạn' : 'Enter your phone number'}
                      value={formData.phone}
                      onChange={handleChange}
                      className="border-beach-200 focus:border-beach-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-beach-800">
                      {language === 'vi' ? 'Tiêu Đề' : 'Subject'} *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      required
                      placeholder={language === 'vi' ? 'Nhập tiêu đề' : 'Enter subject'}
                      value={formData.subject}
                      onChange={handleChange}
                      className="border-beach-200 focus:border-beach-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-beach-800">
                    {language === 'vi' ? 'Tin Nhắn' : 'Message'} *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder={language === 'vi' ? 'Nhập tin nhắn của bạn' : 'Enter your message'}
                    value={formData.message}
                    onChange={handleChange}
                    className="border-beach-200 focus:border-beach-500 resize-none"
                  />
                </div>
                
                <Button type="submit" className="w-full md:w-auto px-8" disabled={loading}>
                  {loading ? (
                    <><span className="mr-2">{language === 'vi' ? 'Đang Gửi' : 'Sending'}</span><span className="animate-spin">...</span></>
                  ) : (
                    language === 'vi' ? 'Gửi Tin Nhắn' : 'Send Message'
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <motion.h2
            className="font-serif text-2xl font-bold mb-6 text-beach-900 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {language === 'vi' ? 'Vị Trí Của Chúng Tôi' : 'Our Location'}
          </motion.h2>
          
          <motion.div
            className="rounded-lg overflow-hidden shadow-lg h-96"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.964630266936!2d107.0809146!3d10.346161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31756fd4554f0cf5%3A0xd3f960b48d3ba98d!2zVHLhuqduIFBow7osIFBoxrDhu51uZyAxLCBWxaluZyBUw6B1LCBCw6AgUuG7h3QgTmFt!5e0!3m2!1svi!2s!4v1696346631979!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Annam Village Location"
            ></iframe>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ContactPage;
