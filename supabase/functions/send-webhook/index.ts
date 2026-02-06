import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function validateInput(data: unknown): { nome: string; email: string; mensagem: string; company?: string; role?: string; contact_type?: string } | null {
  if (!data || typeof data !== 'object') return null;

  const { nome, email, mensagem, company, role, contact_type } = data as Record<string, unknown>;

  if (typeof nome !== 'string' || nome.trim().length === 0 || nome.length > 200) return null;
  if (typeof email !== 'string' || email.length > 255) return null;
  if (typeof mensagem !== 'string' || mensagem.trim().length === 0 || mensagem.length > 5000) return null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return null;

  const result: { nome: string; email: string; mensagem: string; company?: string; role?: string; contact_type?: string } = {
    nome: nome.trim(),
    email: email.trim(),
    mensagem: mensagem.trim(),
  };

  if (typeof company === 'string' && company.trim().length > 0 && company.length <= 200) {
    result.company = company.trim();
  }
  if (typeof role === 'string' && role.trim().length > 0 && role.length <= 200) {
    result.role = role.trim();
  }
  if (typeof contact_type === 'string' && contact_type.trim().length > 0 && contact_type.length <= 200) {
    result.contact_type = contact_type.trim();
  }

  return result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !data?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rawBody = await req.json();
    const validated = validateInput(rawBody);
    if (!validated) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const webhookUrl = Deno.env.get('WEBHOOK_URL');

    if (!webhookUrl) {
      console.log('WEBHOOK_URL not configured, skipping webhook');
      return new Response(JSON.stringify({ success: true, message: 'No webhook configured' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Sending to webhook:', webhookUrl);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validated),
    });

    console.log('Webhook response status:', response.status);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
