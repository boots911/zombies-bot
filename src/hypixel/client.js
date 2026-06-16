let rateLimitRemaining = 120;
let rateLimitResetAt = 0; // ms timestamp when the window resets

async function fetchPlayer(uuid) {
  const now = Date.now();
  if (rateLimitRemaining <= 2 && now < rateLimitResetAt) {
    throw new Error('rate_limited');
  }

  const res = await fetch(`https://api.hypixel.net/v2/player?uuid=${uuid}`, {
    headers: { 'API-Key': process.env.HYPIXEL_API_KEY },
  });

  const remaining = res.headers.get('RateLimit-Remaining');
  const reset = res.headers.get('RateLimit-Reset');
  if (remaining !== null) rateLimitRemaining = parseInt(remaining, 10);
  if (reset !== null) rateLimitResetAt = Date.now() + parseInt(reset, 10) * 1000;

  if (res.status === 429) throw new Error('rate_limited');
  if (res.status === 403) throw new Error('invalid_api_key');
  if (!res.ok) throw new Error(`hypixel_error_${res.status}`);

  const data = await res.json();
  if (!data.success) throw new Error('hypixel_api_failure');
  return data.player; // may be null if player has never joined Hypixel
}

module.exports = { fetchPlayer };
