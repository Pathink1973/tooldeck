import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const cloudinaryUrl = Deno.env.get("CLOUDINARY_API_URL")!;
const cloudinaryPreset = Deno.env.get("CLOUDINARY_UPLOAD_PRESET")!;

const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { record } = await req.json();
    const bucket = record.bucket;
    const filePath = record.name;

    // Validate file extension
    if (!filePath.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return new Response("Invalid file type", { status: 400 });
    }

    // Download image from Supabase Storage
    const { data, error: downloadError } = await supabase.storage
      .from(bucket)
      .download(filePath);

    if (downloadError || !data) {
      throw new Error(`Failed to download image: ${downloadError?.message}`);
    }

    // Convert to base64
    const buffer = await data.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));

    // Upload to Cloudinary
    const formData = new FormData();
    formData.append("file", `data:image/jpeg;base64,${base64}`);
    formData.append("upload_preset", cloudinaryPreset);
    formData.append("folder", "tooldeck");

    const cloudinaryResponse = await fetch(cloudinaryUrl, {
      method: "POST",
      body: formData,
    });

    const cloudinaryResult = await cloudinaryResponse.json();

    if (!cloudinaryResult.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    // Extract card ID from file path
    const cardId = filePath.split("/")[1]; // upload-temp/{cardId}/{filename}

    // Update card with Cloudinary URL
    const { error: updateError } = await supabase
      .from("cards")
      .update({ image_url: cloudinaryResult.secure_url })
      .eq("id", cardId);

    if (updateError) {
      throw new Error(`Failed to update card: ${updateError.message}`);
    }

    // Delete temporary file from Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (deleteError) {
      console.error("Failed to delete temporary file:", deleteError);
    }

    return new Response(JSON.stringify({ url: cloudinaryResult.secure_url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});