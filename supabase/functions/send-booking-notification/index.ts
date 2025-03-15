
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
    throw new Error("RESEND_API_KEY is not set");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Annam Village <notification@annamvillage.vn>",
      to: [emailData.to],
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    }),
  });

  const data = await response.json();
  return { data, status: response.status };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        auth: { persistSession: false }
      }
    );

    const { booking, adminEmail } = await req.json();

    // Format dates
    const checkInDate = new Date(booking.checkIn).toLocaleDateString('vi-VN');
    const checkOutDate = new Date(booking.checkOut).toLocaleDateString('vi-VN');

    // Prepare email content
    const emailHtml = `
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

    // Send email to admin
    const emailResponse = await sendEmail({
      to: adminEmail,
      subject: `[Annam Village] Đặt Phòng Mới từ ${booking.fullName}`,
      html: emailHtml,
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
