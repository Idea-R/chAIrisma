import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Call AI service for makeup detection
    const aiResponse = await fetch(Deno.env.get('AI_SERVICE_URL'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('AI_SERVICE_KEY')}`,
      },
      body: JSON.stringify({ image_url: imageUrl }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI service error: ${aiResponse.status} ${aiResponse.statusText}`);
    }

    let aiData;
    try {
      aiData = await aiResponse.json();
    } catch (error) {
      throw new Error('Invalid response from AI service');
    }

    if (!aiData) {
      throw new Error('Empty response from AI service');
    }

    // Store analysis results
    const { data, error } = await supabaseClient
      .from('makeup_analyses')
      .insert({
        image_url: imageUrl,
        analysis_results: aiData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to store analysis results');
    }

    return new Response(
      JSON.stringify(data.analysis_results),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Analysis error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred during makeup analysis',
        details: error.stack
      }),
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