import type { APIRoute } from 'astro';

export const prerender = false;

const REQUIRED_FIELDS = ['name', 'phone', 'grade', 'governorate'] as const;
const MAX_FIELD_LENGTH = 200;

export const POST: APIRoute = async ({ request, locals }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  for (const field of REQUIRED_FIELDS) {
    const value = body[field];
    if (typeof value !== 'string' || value.trim().length === 0) {
      return json({ ok: false, error: `missing_${field}` }, 400);
    }
    if (value.length > MAX_FIELD_LENGTH) {
      return json({ ok: false, error: `${field}_too_long` }, 400);
    }
  }

  const lead = {
    name: String(body.name).trim(),
    phone: String(body.phone).trim(),
    guardianPhone: typeof body.guardianPhone === 'string' ? body.guardianPhone.trim().slice(0, MAX_FIELD_LENGTH) : '',
    grade: String(body.grade).trim(),
    governorate: String(body.governorate).trim(),
    format: typeof body.format === 'string' ? body.format.trim().slice(0, MAX_FIELD_LENGTH) : '',
    submittedAt: new Date().toISOString(),
  };

  const kv = locals.runtime?.env?.LEADS;
  if (!kv) {
    // Local dev without `wrangler` / KV bound yet — don't fail the demo, just log.
    console.warn('LEADS KV binding not available; lead not persisted:', lead);
    return json({ ok: true, persisted: false });
  }

  const key = `${lead.submittedAt}-${crypto.randomUUID()}`;
  await kv.put(key, JSON.stringify(lead));

  return json({ ok: true, persisted: true });
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
