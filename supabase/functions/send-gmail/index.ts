import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailData {
  to: string;
  subject: string;
  html: string;
  type: 'booking_confirmation' | 'booking_notification' | 'consultation_confirmation' | 'consultation_notification' | 'consultation_response';
}

interface BookingData {
  fullName: string;
  email: string;
  phone: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  specialRequests?: string;
  totalPrice: number;
  bookingId: string;
}

interface ConsultationData {
  fullName: string;
  email: string;
  phone: string;
  consultationType: string;
  preferredDate?: string;
  message?: string;
  consultationId: string;
  adminResponse?: string;
}

const createBookingConfirmationEmail = (data: BookingData): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">Anna's Village</h1>
        <p style="color: #666; margin: 5px 0;">Resort & Spa</p>
      </div>
      
      <h2 style="color: #1f2937;">Xác nhận đặt phòng</h2>
      
      <p>Xin chào ${data.fullName},</p>
      
      <p>Cảm ơn bạn đã đặt phòng tại Anna's Village Resort & Spa. Chúng tôi đã nhận được yêu cầu đặt phòng của bạn với thông tin như sau:</p>
      
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1f2937;">Thông tin đặt phòng</h3>
        <p><strong>Mã đặt phòng:</strong> ${data.bookingId}</p>
        <p><strong>Loại phòng:</strong> ${data.roomType}</p>
        <p><strong>Ngày nhận phòng:</strong> ${data.checkIn}</p>
        <p><strong>Ngày trả phòng:</strong> ${data.checkOut}</p>
        <p><strong>Số khách:</strong> ${data.adults} người lớn${data.children > 0 ? `, ${data.children} trẻ em` : ''}</p>
        <p><strong>Tổng tiền:</strong> ${data.totalPrice.toLocaleString('vi-VN')} VNĐ</p>
        ${data.specialRequests ? `<p><strong>Yêu cầu đặc biệt:</strong> ${data.specialRequests}</p>` : ''}
      </div>
      
      <p>Yêu cầu đặt phòng của bạn đang được xem xét. Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận và hướng dẫn thanh toán.</p>
      
      <p>Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi:</p>
      <p>📞 Hotline: 0123 456 789<br>
      📧 Email: annamvillage.vn@gmail.com</p>
      
      <p>Trân trọng,<br>
      Đội ngũ Anna's Village Resort & Spa</p>
    </div>
  `;
};

const createBookingNotificationEmail = (data: BookingData): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #dc2626;">Thông báo đặt phòng mới</h2>
      
      <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626;">
        <h3 style="margin-top: 0; color: #1f2937;">Thông tin khách hàng</h3>
        <p><strong>Họ tên:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Điện thoại:</strong> ${data.phone}</p>
        
        <h3 style="color: #1f2937;">Thông tin đặt phòng</h3>
        <p><strong>Mã đặt phòng:</strong> ${data.bookingId}</p>
        <p><strong>Loại phòng:</strong> ${data.roomType}</p>
        <p><strong>Ngày nhận phòng:</strong> ${data.checkIn}</p>
        <p><strong>Ngày trả phòng:</strong> ${data.checkOut}</p>
        <p><strong>Số khách:</strong> ${data.adults} người lớn${data.children > 0 ? `, ${data.children} trẻ em` : ''}</p>
        <p><strong>Tổng tiền:</strong> ${data.totalPrice.toLocaleString('vi-VN')} VNĐ</p>
        ${data.specialRequests ? `<p><strong>Yêu cầu đặc biệt:</strong> ${data.specialRequests}</p>` : ''}
      </div>
      
      <p>Vui lòng kiểm tra và xác nhận đặt phòng trong hệ thống quản trị.</p>
    </div>
  `;
};

const createConsultationConfirmationEmail = (data: ConsultationData): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">Anna's Village</h1>
        <p style="color: #666; margin: 5px 0;">Resort & Spa</p>
      </div>
      
      <h2 style="color: #1f2937;">Xác nhận yêu cầu tư vấn</h2>
      
      <p>Xin chào ${data.fullName},</p>
      
      <p>Cảm ơn bạn đã gửi yêu cầu tư vấn đến Anna's Village Resort & Spa. Chúng tôi đã nhận được thông tin của bạn:</p>
      
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1f2937;">Thông tin tư vấn</h3>
        <p><strong>Mã yêu cầu:</strong> ${data.consultationId}</p>
        <p><strong>Loại tư vấn:</strong> ${data.consultationType}</p>
        ${data.preferredDate ? `<p><strong>Ngày mong muốn:</strong> ${data.preferredDate}</p>` : ''}
        ${data.message ? `<p><strong>Nội dung:</strong> ${data.message}</p>` : ''}
      </div>
      
      <p>Đội ngũ tư vấn của chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để hỗ trợ tốt nhất.</p>
      
      <p>Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi:</p>
      <p>📞 Hotline: 0123 456 789<br>
      📧 Email: annamvillage.vn@gmail.com</p>
      
      <p>Trân trọng,<br>
      Đội ngũ Anna's Village Resort & Spa</p>
    </div>
  `;
};

const createConsultationNotificationEmail = (data: ConsultationData): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #dc2626;">Yêu cầu tư vấn mới</h2>
      
      <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626;">
        <h3 style="margin-top: 0; color: #1f2937;">Thông tin khách hàng</h3>
        <p><strong>Họ tên:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Điện thoại:</strong> ${data.phone}</p>
        
        <h3 style="color: #1f2937;">Thông tin tư vấn</h3>
        <p><strong>Mã yêu cầu:</strong> ${data.consultationId}</p>
        <p><strong>Loại tư vấn:</strong> ${data.consultationType}</p>
        ${data.preferredDate ? `<p><strong>Ngày mong muốn:</strong> ${data.preferredDate}</p>` : ''}
        ${data.message ? `<p><strong>Nội dung:</strong> ${data.message}</p>` : ''}
      </div>
      
      <p>Vui lòng kiểm tra và phản hồi trong hệ thống quản trị.</p>
    </div>
  `;
};

const createConsultationResponseEmail = (data: ConsultationData): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">Anna's Village</h1>
        <p style="color: #666; margin: 5px 0;">Resort & Spa</p>
      </div>
      
      <h2 style="color: #1f2937;">Phản hồi tư vấn</h2>
      
      <p>Xin chào ${data.fullName},</p>
      
      <p>Cảm ơn bạn đã tin tưởng Anna's Village Resort & Spa. Chúng tôi gửi phản hồi cho yêu cầu tư vấn của bạn:</p>
      
      <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
        <h3 style="margin-top: 0; color: #1f2937;">Phản hồi từ đội ngũ tư vấn</h3>
        <p style="line-height: 1.6;">${data.adminResponse}</p>
      </div>
      
      <p>Nếu bạn có thêm bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi:</p>
      <p>📞 Hotline: 0123 456 789<br>
      📧 Email: annamvillage.vn@gmail.com</p>
      
      <p>Trân trọng,<br>
      Đội ngũ Anna's Village Resort & Spa</p>
    </div>
  `;
};

async function sendEmail(emailData: EmailData): Promise<Response> {
  try {
    console.log('Sending email:', emailData.type, 'to:', emailData.to);

    const response = await fetch("https://api.smtp.cloud/v4/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get('GMAIL_APP_PASSWORD')}`,
      },
      body: JSON.stringify({
        from: {
          email: Deno.env.get('GMAIL_EMAIL'),
          name: "Anna's Village Resort & Spa"
        },
        to: [{ email: emailData.to }],
        subject: emailData.subject,
        html: emailData.html,
        smtp: {
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: Deno.env.get('GMAIL_EMAIL'),
            pass: Deno.env.get('GMAIL_APP_PASSWORD')
          }
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`SMTP API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    // Fallback: Use direct SMTP
    try {
      const nodemailerResponse = await fetch("https://api.nodemailer.com/smtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: Deno.env.get('GMAIL_EMAIL'),
            pass: Deno.env.get('GMAIL_APP_PASSWORD')
          },
          from: `"Anna's Village Resort & Spa" <${Deno.env.get('GMAIL_EMAIL')}>`,
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html
        }),
      });

      if (nodemailerResponse.ok) {
        const result = await nodemailerResponse.json();
        return new Response(JSON.stringify({ success: true, result }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    } catch (fallbackError) {
      console.error('Fallback email failed:', fallbackError);
    }

    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();

    let emailData: EmailData;

    switch (type) {
      case 'booking_confirmation':
        emailData = {
          to: data.email,
          subject: `Xác nhận đặt phòng - Anna's Village Resort & Spa`,
          html: createBookingConfirmationEmail(data),
          type: 'booking_confirmation'
        };
        break;

      case 'booking_notification':
        emailData = {
          to: Deno.env.get('ADMIN_EMAIL') || Deno.env.get('GMAIL_EMAIL') || '',
          subject: `Đặt phòng mới - ${data.fullName}`,
          html: createBookingNotificationEmail(data),
          type: 'booking_notification'
        };
        break;

      case 'consultation_confirmation':
        emailData = {
          to: data.email,
          subject: `Xác nhận yêu cầu tư vấn - Anna's Village Resort & Spa`,
          html: createConsultationConfirmationEmail(data),
          type: 'consultation_confirmation'
        };
        break;

      case 'consultation_notification':
        emailData = {
          to: Deno.env.get('ADMIN_EMAIL') || Deno.env.get('GMAIL_EMAIL') || '',
          subject: `Yêu cầu tư vấn mới - ${data.fullName}`,
          html: createConsultationNotificationEmail(data),
          type: 'consultation_notification'
        };
        break;

      case 'consultation_response':
        emailData = {
          to: data.email,
          subject: `Phản hồi tư vấn - Anna's Village Resort & Spa`,
          html: createConsultationResponseEmail(data),
          type: 'consultation_response'
        };
        break;

      default:
        throw new Error('Invalid email type');
    }

    return await sendEmail(emailData);

  } catch (error) {
    console.error('Error in send-gmail function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);