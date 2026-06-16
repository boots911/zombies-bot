async function usernameToUuid(username) {
  const res = await fetch(
    `https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username)}`
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Mojang API error: ${res.status}`);
  const data = await res.json();
  return {
    uuid: addHyphens(data.id),
    username: data.name,
  };
}

// Mojang returns UUIDs without hyphens; normalize to standard format.
function addHyphens(raw) {
  if (raw.includes('-')) return raw;
  return `${raw.slice(0,8)}-${raw.slice(8,12)}-${raw.slice(12,16)}-${raw.slice(16,20)}-${raw.slice(20)}`;
}

module.exports = { usernameToUuid };
