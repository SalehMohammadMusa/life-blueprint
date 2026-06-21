import webpush from 'npm:web-push@3.6.7';

const VAPID_PUBLIC  = 'BIkqDJwXWk6-cLvVa8N1NdCViXcHFQ_bVX66zFx32OSXpYTAA4Qh6fDUdmCIDFHBkKw1FP1KelgRihkcfJOX9Pk';
const VAPID_PRIVATE = 'uW-wddVcnGCUT7-2MF8sBaCFwKpGRIMHJjJdYcW_wFk';
const SUPABASE_URL  = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

webpush.setVapidDetails('mailto:musa.saleh@cartrack.com', VAPID_PUBLIC, VAPID_PRIVATE);

Deno.serve(async () => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/push_subscriptions?select=subscription,last_open`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  });
  const rows = await res.json();
  const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;

  for (const row of rows) {
    const lastOpen = new Date(row.last_open).getTime();
    if (lastOpen < twoHoursAgo) {
      try {
        await webpush.sendNotification(row.subscription, JSON.stringify({
          title: 'Life Blueprint 🗺️',
          body: "Haven't checked in for 2 hours — tap to log your habits!"
        }));
      } catch(e) { console.error('Push failed:', e.message); }
    }
  }
  return new Response('done');
});
