
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự.",
  }),
  email: z.string().email({
    message: "Vui lòng nhập một email hợp lệ.",
  }),
  phone: z.string().min(10, {
    message: "Số điện thoại phải có ít nhất 10 số.",
  }),
  message: z.string().min(10, {
    message: "Tin nhắn phải có ít nhất 10 ký tự.",
  }),
});

const ContactPage = () => {
  const { language } = useLanguage();
  const isEnglish = language === 'en';
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setSuccess(true);

    // Using our toast component instead of sonner directly
    toast({
      title: isEnglish ? "Message Sent" : "Đã Gửi Tin Nhắn",
      description: isEnglish
        ? "We will contact you soon!"
        : "Chúng tôi sẽ liên hệ với bạn sớm!",
    });

    form.reset();

    setTimeout(() => {
      setSuccess(false);
      navigate('/');
    }, 3000);
  };

  return (
    <MainLayout>
      <div className="bg-beach-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="px-10 py-12">
              <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
                {isEnglish ? "Contact Us" : "Liên Hệ Với Chúng Tôi"}
              </h1>
              <p className="text-gray-600 text-center mb-8">
                {isEnglish
                  ? "We'd love to hear from you! Please fill out the form below to get in touch."
                  : "Chúng tôi rất mong nhận được phản hồi từ bạn! Vui lòng điền vào mẫu bên dưới để liên hệ."}
              </p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{isEnglish ? "Name" : "Tên"}</FormLabel>
                        <FormControl>
                          <Input placeholder={isEnglish ? "Your name" : "Tên của bạn"} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{isEnglish ? "Phone Number" : "Số Điện Thoại"}</FormLabel>
                        <FormControl>
                          <Input placeholder="0909000999" type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{isEnglish ? "Message" : "Tin Nhắn"}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={isEnglish ? "Your message here" : "Tin nhắn của bạn ở đây"}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={success}>
                    {success
                      ? isEnglish
                        ? "Sending..."
                        : "Đang Gửi..."
                      : isEnglish
                        ? "Send Message"
                        : "Gửi Tin Nhắn"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
