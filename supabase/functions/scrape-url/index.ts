import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import * as cheerio from 'npm:cheerio@1.0.0-rc.12';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url).searchParams.get('url');
    if (!url) {
      throw new Error('URL parameter is required');
    }

    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const images = [];
    $('img').each((_, element) => {
      const $img = $(element);
      const imgUrl = $img.attr('src');
      const alt = $img.attr('alt');
      
      if (imgUrl && imgUrl.match(/\.(jpg|jpeg|png|webp)$/i)) {
        // Convert relative URLs to absolute
        const absoluteUrl = new URL(imgUrl, url).href;
        images.push({
          url: absoluteUrl,
          alt: alt || '',
        });
      }
    });

    return new Response(
      JSON.stringify({ images }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});