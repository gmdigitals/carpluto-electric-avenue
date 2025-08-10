import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TestDriveEmailRequest {
  user_name: string;
  email: string;
  ev_model: string;
  date: string;
  time: string;
  location: string;
  booking_id: string;
  dealer_phone?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      user_name, 
      email, 
      ev_model, 
      date, 
      time, 
      location, 
      booking_id,
      dealer_phone = "+234-902-1475-523"
    }: TestDriveEmailRequest = await req.json();

    const modifyBookingUrl = `https://carpluto.com.ng/test-drive/modify/${booking_id}`;
    const vehicleDetailsUrl = `https://carpluto.com.ng/vehicles/${booking_id}`;

    const emailResponse = await resend.emails.send({
      from: "CARPLUTO <bookings@carpluto.com.ng>",
      to: [email],
      subject: `Your Test Drive is Booked – ${ev_model}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Test Drive Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background-color: #E82127; padding: 20px; text-align: center;">
              <div style="color: white; font-size: 24px; font-weight: bold;">CARPLUTO</div>
            </div>
            
            <!-- EV Image placeholder -->
            <div style="background-color: #f1f5f9; padding: 20px; text-align: center;">
              <div style="background-color: #e2e8f0; height: 200px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 18px;">
                ${ev_model}
              </div>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <h1 style="color: #1e293b; margin-bottom: 20px;">Hi ${user_name},</h1>
              
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Your test drive is confirmed!
              </p>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <p style="color: #1e293b; font-size: 16px; margin: 8px 0;"><strong>📅 Date:</strong> ${date}</p>
                <p style="color: #1e293b; font-size: 16px; margin: 8px 0;"><strong>⏰ Time:</strong> ${time}</p>
                <p style="color: #1e293b; font-size: 16px; margin: 8px 0;"><strong>📍 Location:</strong> ${location}</p>
                <p style="color: #1e293b; font-size: 16px; margin: 8px 0;"><strong>🚗 Vehicle:</strong> ${ev_model}</p>
              </div>
              
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                <strong>Prepare:</strong> Bring your driver's license. Need to reschedule? 
                <a href="${modifyBookingUrl}" style="color: #E82127;">Modify Booking</a>.
              </p>
              
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${vehicleDetailsUrl}" style="background-color: #E82127; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  View EV Details
                </a>
              </div>
              
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                Questions? Reply to this email or call <a href="tel:${dealer_phone}" style="color: #E82127;">${dealer_phone}</a>.
              </p>
              
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 30px;">
                Enjoy the ride,<br>
                CARPLUTO Team
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 14px; margin: 0;">
                © 2024 CARPLUTO.com.ng<br>
                <a href="#" style="color: #64748b; text-decoration: none;">Unsubscribe</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Test drive confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending test drive confirmation email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);