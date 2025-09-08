import type { APIRoute } from 'astro';
import { CONTACT_EMAIL } from '../../config/server';

export const post: APIRoute = async ({ request }) => {
  const { name, email, subject, message } = await request.json();

  if (!CONTACT_EMAIL) {
    return new Response(
      JSON.stringify({ error: 'Contact email not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // TODO: send email using CONTACT_EMAIL as recipient
  console.log('Contact form submission', { name, email, subject, message });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

