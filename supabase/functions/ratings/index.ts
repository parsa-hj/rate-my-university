import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { action, ratingId, ratingData } = await req.json();

    switch (action) {
      case "create":
        const { data: newRating, error: createError } = await supabaseClient
          .from("rating")
          .insert([ratingData])
          .select()
          .single();

        if (createError) throw createError;
        return new Response(JSON.stringify(newRating), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 201,
        });

      case "update":
        const { data: updatedRating, error: updateError } = await supabaseClient
          .from("rating")
          .update({ RatingComment: ratingData.RatingComment })
          .eq("RatingID", ratingId)
          .select()
          .single();

        if (updateError) throw updateError;
        return new Response(JSON.stringify(updatedRating), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });

      case "delete":
        const { error: deleteError } = await supabaseClient
          .from("rating")
          .delete()
          .eq("RatingID", ratingId);

        if (deleteError) throw deleteError;
        return new Response(
          JSON.stringify({ message: "Rating deleted successfully" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );

      default:
        throw new Error("Invalid action");
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
