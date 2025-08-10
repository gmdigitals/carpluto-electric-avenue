import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PurchaseEmailRequest {
  user_name: string;
  email: string;
  ev_model: string;
  price: number;
  order_id: string;
  paystack_link?: string;
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
      price, 
      order_id,
      paystack_link = "#"
    }: PurchaseEmailRequest = await req.json();

    const trackOrderUrl = `https://carpluto.com.ng/orders/${order_id}`;
    const formattedPrice = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);

    const emailResponse = await resend.emails.send({
      from: "CARPLUTO <orders@carpluto.com.ng>",
      to: [email],
      subject: `Congratulations! Your ${ev_model} is Reserved 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Purchase Confirmation</title>
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
              
              <p style="color: #475569; font-size: 18px; line-height: 1.6; margin-bottom: 30px; font-weight: bold;">
                Your ${ev_model} is secured!
              </p>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="color: #1e293b; margin-bottom: 15px;">🔑 Next Steps:</h3>
                <ol style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0; padding-left: 20px;">
                  <li><strong>Payment:</strong> Complete via Paystack below</li>
                  <li><strong>Delivery:</strong> Expect a call within 24hrs to schedule pickup/shipping</li>
                  <li><strong>Support:</strong> WhatsApp us for quick help</li>
                </ol>
              </div>
              
              ${paystack_link !== "#" ? `
                <div style="text-align: center; margin-bottom: 30px;">
                  <a href="${paystack_link}" style="background-color: #E82127; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 18px;">
                    Pay Now
                  </a>
                </div>
              ` : ''}
              
              <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="color: #1e293b; margin-bottom: 15px;">📝 Order Summary</h3>
                <p style="color: #475569; font-size: 16px; margin: 8px 0;"><strong>Vehicle:</strong> ${ev_model}</p>
                <p style="color: #475569; font-size: 16px; margin: 8px 0;"><strong>Amount:</strong> ${formattedPrice}</p>
                <p style="color: #475569; font-size: 16px; margin: 8px 0;"><strong>Order #:</strong> ${order_id}</p>
              </div>
              
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${trackOrderUrl}" style="background-color: #f8fafc; color: #E82127; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; border: 2px solid #E82127;">
                  Track Order
                </a>
              </div>
              
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Need help? Chat with us on WhatsApp: <a href="https://wa.me/2349021475523" style="color: #E82127;">+234-902-1475-523</a>.
              </p>
              
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                Welcome to the EV revolution!<br>
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

    console.log("Purchase confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending purchase confirmation email:", error);
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