import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  name: string;
  email: string;
  verify_token?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, verify_token }: WelcomeEmailRequest = await req.json();

    const verifyUrl = verify_token 
      ? `${Deno.env.get("SUPABASE_URL")}/auth/v1/verify?token=${verify_token}&type=signup&redirect_to=${Deno.env.get("SUPABASE_URL")}`
      : "#";

    const emailResponse = await resend.emails.send({
      from: "CARPLUTO <welcome@carpluto.com.ng>",
      to: [email],
      subject: "Welcome to CARPLUTO – Your EV Journey Starts Here!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to CARPLUTO</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background-color: #E82127; padding: 20px; text-align: center;">
              <div style="color: white; font-size: 24px; font-weight: bold;">CARPLUTO</div>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <h1 style="color: #1e293b; margin-bottom: 20px;">Hi ${name},</h1>
              
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Welcome to Nigeria's premier EV marketplace! 🚗⚡
              </p>
              
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Now you can:
              </p>
              
              <ul style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                <li>✓ Browse 100+ verified electric vehicles</li>
                <li>✓ Compare models with our AI tool</li>
                <li>✓ Save ₦50,000+/month on fuel costs</li>
              </ul>
              
              ${verify_token ? `
                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                  <strong>Verify your email</strong> to unlock full access:
                </p>
                
                <div style="text-align: center; margin-bottom: 30px;">
                  <a href="${verifyUrl}" style="background-color: #E82127; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                    Verify Email
                  </a>
                </div>
              ` : ''}
              
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Need help? Chat with us on WhatsApp: <a href="https://wa.me/2349021475523" style="color: #E82127;">+234-902-1475-523</a>.
              </p>
              
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                Drive green,<br>
                The CARPLUTO Team
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

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
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