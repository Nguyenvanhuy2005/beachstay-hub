
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

async function sendEmail(emailData: EmailData) {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set in environment variables");
    throw new Error("RESEND_API_KEY is not set");
  }

  console.log("Sending email to:", emailData.to);
  console.log("Email subject:", emailData.subject);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Annam Village <no-reply@booking.annamvillage.com>",
        to: [emailData.to],
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      }),
    });

    const data = await response.json();
    console.log("Email API response:", data);
    
    if (!response.ok) {
      console.error(`Resend API error status: ${response.status}`);
      console.error(`Resend API error body: ${JSON.stringify(data)}`);
      throw new Error(`Resend API error: ${response.status} ${JSON.stringify(data)}`);
    }
    
    return { data, status: response.status };
  } catch (error) {
    console.error("Error in sendEmail function:", error);
    throw error;
  }
}

serve(async (req) => {
  console.log("🚀 Received request to send-booking-notification function");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }
    
    console.log("Initializing Supabase client");
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data received:", JSON.stringify(requestData));
    } catch (error) {
      console.error("Error parsing request JSON:", error);
      return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    
    // Check which type of notification to send
    if (requestData.booking) {
      // Handle booking notification
      const { booking, adminEmail } = requestData;
      console.log("Processing booking notification for admin:", adminEmail);
      console.log("Booking data:", JSON.stringify(booking));

      // Format dates
      const checkInDate = new Date(booking.checkIn).toLocaleDateString('vi-VN');
      const checkOutDate = new Date(booking.checkOut).toLocaleDateString('vi-VN');

      // Send email to admin
      try {
        // Prepare admin email content
        const adminEmailHtml = `
          <h1>Thông Báo Đặt Phòng Mới</h1>
          <p>Có một đặt phòng mới tại Annam Village:</p>
          <hr>
          <h2>Chi Tiết Đặt Phòng</h2>
          <ul>
            <li><strong>Tên khách hàng:</strong> ${booking.fullName}</li>
            <li><strong>Email:</strong> ${booking.email}</li>
            <li><strong>Số điện thoại:</strong> ${booking.phone}</li>
            <li><strong>Ngày đến:</strong> ${checkInDate}</li>
            <li><strong>Ngày đi:</strong> ${checkOutDate}</li>
            <li><strong>Loại phòng:</strong> ${booking.roomType}</li>
            <li><strong>Số người lớn:</strong> ${booking.adults}</li>
            <li><strong>Số trẻ em:</strong> ${booking.children}</li>
            ${booking.specialRequests ? `<li><strong>Yêu cầu đặc biệt:</strong> ${booking.specialRequests}</li>` : ''}
          </ul>
          <p>Vui lòng xác nhận đặt phòng này càng sớm càng tốt.</p>
          <p>Xin cảm ơn,<br>Hệ thống Annam Village</p>
        `;

        console.log("Sending admin notification email to:", adminEmail);
        const adminEmailResponse = await sendEmail({
          to: adminEmail,
          subject: `[Annam Village] Đặt Phòng Mới từ ${booking.fullName}`,
          html: adminEmailHtml,
        });
        console.log("Admin email sent successfully:", adminEmailResponse);

        // Prepare customer email content
        const customerEmailHtml = `
          <h1>Xác Nhận Đặt Phòng - Annam Village</h1>
          <p>Chào ${booking.fullName},</p>
          <p>Cảm ơn bạn đã đặt phòng tại Annam Village. Dưới đây là thông tin chi tiết về đặt phòng của bạn:</p>
          <hr>
          <h2>Chi Tiết Đặt Phòng</h2>
          <ul>
            <li><strong>Tên khách hàng:</strong> ${booking.fullName}</li>
            <li><strong>Ngày nhận phòng:</strong> ${checkInDate}</li>
            <li><strong>Ngày trả phòng:</strong> ${checkOutDate}</li>
            <li><strong>Số người lớn:</strong> ${booking.adults}</li>
            <li><strong>Số trẻ em:</strong> ${booking.children}</li>
            ${booking.specialRequests ? `<li><strong>Yêu cầu đặc biệt:</strong> ${booking.specialRequests}</li>` : ''}
          </ul>
          <p>Trạng thái đặt phòng: <strong>Chờ xác nhận</strong></p>
          <p>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đặt phòng.</p>
          <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại.</p>
          <p>Xin cảm ơn,<br>Annam Village</p>
        `;

        console.log("Sending customer confirmation email to:", booking.email);
        const customerEmailResponse = await sendEmail({
          to: booking.email,
          subject: `Xác Nhận Đặt Phòng - Annam Village`,
          html: customerEmailHtml,
        });
        console.log("Customer email sent successfully:", customerEmailResponse);

        return new Response(JSON.stringify({ 
          success: true, 
          adminEmail: adminEmailResponse, 
          customerEmail: customerEmailResponse 
        }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        return new Response(JSON.stringify({ error: emailError.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    } 
    else if (requestData.blogPost) {
      // Handle blog post notification
      const { blogPost, adminEmail } = requestData;
      console.log("Processing blog post notification:", blogPost.title);
      
      // Prepare email content for blog post
      const emailHtml = `
        <h1>Thông Báo Bài Viết Mới</h1>
        <p>Một bài viết mới đã được tạo trên Annam Village:</p>
        <hr>
        <h2>Chi Tiết Bài Viết</h2>
        <ul>
          <li><strong>Tiêu đề:</strong> ${blogPost.title}</li>
          <li><strong>Tác giả:</strong> ${blogPost.author}</li>
          <li><strong>Ngày tạo:</strong> ${new Date(blogPost.created_at).toLocaleDateString('vi-VN')}</li>
          <li><strong>Trạng thái:</strong> ${blogPost.published ? 'Đã xuất bản' : 'Bản nháp'}</li>
          <li><strong>Đường dẫn:</strong> /blog/${blogPost.slug}</li>
        </ul>
        <p>Truy cập trang quản trị để xem và quản lý bài viết.</p>
        <p>Xin cảm ơn,<br>Hệ thống Annam Village</p>
      `;
      
      try {
        console.log("Sending blog post notification email to:", adminEmail);
        // Send email to admin
        const emailResponse = await sendEmail({
          to: adminEmail,
          subject: `[Annam Village] Bài Viết Mới: ${blogPost.title}`,
          html: emailHtml,
        });
        console.log("Blog post notification email sent successfully:", emailResponse);
        
        return new Response(JSON.stringify(emailResponse), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch (emailError) {
        console.error("Failed to send blog post notification:", emailError);
        return new Response(JSON.stringify({ error: emailError.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }
    
    // If neither booking nor blogPost is provided
    return new Response(JSON.stringify({ error: "Invalid request data - missing booking or blogPost object" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Error in send-booking-notification function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
