"use client";

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự." }),
  email: z.string().email({ message: "Vui lòng nhập địa chỉ email hợp lệ." }),
  phone: z.string().min(10, { message: "Số điện thoại phải có ít nhất 10 số." }),
  subject: z.string().min(5, { message: "Tiêu đề phải có ít nhất 5 ký tự." }),
  message: z.string().min(10, { message: "Nội dung tin nhắn phải có ít nhất 10 ký tự." }),
});

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log('Đang gửi tin nhắn:', values);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        toast.success("Tin nhắn đã được gửi thành công! Chúng tôi đã gửi email xác nhận đến bạn.");
        form.reset();
      } else {
        toast.error(`Lỗi: ${responseData.message || 'Có lỗi xảy ra khi gửi tin nhắn'}`);
      }
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
      toast.error("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ ngay!
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Thông Tin Liên Hệ</h2>
              <p className="text-gray-600 mb-6">
                Chúng tôi rất mong nhận được tin nhắn từ bạn. Hãy điền form bên cạnh và chúng tôi sẽ phản hồi trong thời gian sớm nhất.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 p-3 rounded-full">
                  <MapPin size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Địa chỉ</h3>
                  <p className="text-gray-600">
                    116 Nguyễn Huy Tưởng, Phường Hòa Minh<br />
                    Quận Liên Chiểu, TP. Đà Nẵng
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 p-3 rounded-full">
                  <Phone size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Điện thoại</h3>
                  <p className="text-gray-600">
                    <a href="tel:0344757955" className="hover:text-blue-600">0344 757 955</a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 p-3 rounded-full">
                  <Mail size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                  <p className="text-gray-600">
                    <a href="mailto:chinhnvpd10204@gmail.com" className="hover:text-blue-600">chinhnvpd10204@gmail.com</a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 p-3 rounded-full">
                  <Clock size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Giờ làm việc</h3>
                  <div className="text-gray-600 space-y-1">
                    <p>Thứ 2 - Thứ 6: 7:00 - 20:00</p>
                    <p>Thứ 7: 7:00 - 17:00</p>
                    <p>Chủ nhật: 8:00 - 12:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">Gửi Tin Nhắn Cho Chúng Tôi</CardTitle>
              <CardDescription className="text-gray-600">
                Điền thông tin bên dưới và chúng tôi sẽ phản hồi trong thời gian sớm nhất.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập họ và tên của bạn" {...field} />
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
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} />
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
                        <FormLabel>Số điện thoại *</FormLabel>
                        <FormControl>
                          <Input placeholder="0344 757 955" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiêu đề *</FormLabel>
                        <FormControl>
                          <Input placeholder="Chúng tôi có thể giúp gì cho bạn?" {...field} />
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
                        <FormLabel>Nội dung tin nhắn *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Hãy mô tả chi tiết vấn đề hoặc câu hỏi của bạn..." 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang gửi...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send size={16} />
                        Gửi Tin Nhắn
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}