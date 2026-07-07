import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const VALID_ICON_KEYS = [
  "dev", "ai", "genai", "design", "illustration", "photo", "image",
  "finance", "banking", "wallet", "security", "privacy", "music", "audio",
  "video", "gaming", "productivity", "marketing", "ecommerce", "education",
  "reading", "fitness", "health", "analytics", "data", "cloud",
  "communication", "email", "hardware", "mobile", "layers", "science",
  "physics", "microscopy", "travel", "explore", "calendar", "tools", "api",
  "chip", "robot", "charts", "reporting", "plugin", "gift", "search",
  "magic", "web", "link",
];

async function fetchPageContext(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ToolDeck/1.0; +https://tooldeck.app)",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return "";

    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const metaDescMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
    );
    const ogDescMatch = html.match(
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i
    );
    const ogTitleMatch = html.match(
      /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i
    );

    const parts: string[] = [];
    if (titleMatch?.[1]) parts.push(`Title: ${titleMatch[1].trim()}`);
    if (ogTitleMatch?.[1] && ogTitleMatch[1] !== titleMatch?.[1])
      parts.push(`OG Title: ${ogTitleMatch[1].trim()}`);
    if (metaDescMatch?.[1])
      parts.push(`Description: ${metaDescMatch[1].trim()}`);
    if (ogDescMatch?.[1] && ogDescMatch[1] !== metaDescMatch?.[1])
      parts.push(`OG Description: ${ogDescMatch[1].trim()}`);

    return parts.join("\n");
  } catch {
    return "";
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { url, imageUrl } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      return new Response(
        JSON.stringify({
          error: "OPENAI_API_KEY not configured",
          description: "Recurso web guardado",
          tags: ["sem-tag"],
          icon_key: "web",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const pageContext = await fetchPageContext(url);

    const prompt = `Analyze this web resource and provide metadata in Portuguese (pt-PT).

URL: ${url}
${pageContext ? `\nPage metadata:\n${pageContext}` : ""}
${imageUrl ? `Image URL: ${imageUrl}` : ""}

Provide:
1. A concise description in Portuguese (max 150 characters) of what this tool or resource is about
2. A list of 3-5 relevant tags (single words or short phrases, in Portuguese when appropriate)
3. An icon_key from this list that best represents the category of this resource: ${VALID_ICON_KEYS.join(", ")}

Respond ONLY with valid JSON: {"description": "...", "tags": ["...", "..."], "icon_key": "..."}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an AI that analyzes web resources and provides concise descriptions, relevant tags, and categorizes them with an icon_key. Always respond with valid JSON only.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenAI API error:", response.status, err);
      return new Response(
        JSON.stringify({
          description: "Recurso web guardado",
          tags: ["sem-tag"],
          icon_key: "web",
          _error: `OpenAI ${response.status}`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content in OpenAI response");

    const parsed = JSON.parse(content);

    const iconKey = VALID_ICON_KEYS.includes(parsed.icon_key)
      ? parsed.icon_key
      : "web";

    return new Response(
      JSON.stringify({
        description: parsed.description || "Recurso web guardado",
        tags: Array.isArray(parsed.tags) && parsed.tags.length > 0
          ? parsed.tags
          : ["sem-tag"],
        icon_key: iconKey,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("generate-card-meta error:", error?.message || error);
    return new Response(
      JSON.stringify({
        description: "Recurso web guardado",
        tags: ["sem-tag"],
        icon_key: "web",
        _error: error?.message || "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
