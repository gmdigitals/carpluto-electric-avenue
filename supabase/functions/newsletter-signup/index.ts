import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NewsletterRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: NewsletterRequest = await req.json();

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: "Valid email address is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Note: This is a placeholder for MailChimp integration
    // The user will need to provide their MailChimp API key and list ID
    // For now, we'll just log the signup and return success
    
    console.log(`Newsletter signup attempt: ${email}`);
    
    // TODO: Integrate with MailChimp API
    // const mailchimpApiKey = Deno.env.get("MAILCHIMP_API_KEY");
    // const listId = Deno.env.get("MAILCHIMP_LIST_ID");
    
    // For demonstration, return success
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Successfully subscribed to newsletter!" 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in newsletter signup:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process newsletter signup" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);