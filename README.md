# Hypixel Zombies Stats Bot

A Discord bot for a Hypixel Zombies community. Players run slash commands to
look up player stats and leaderboards, rendered as image cards.

## Features

- `/stats <player>` — overall stats card, with buttons to jump to per-map cards,
  rankings, and kill breakdowns.
- `/deadend`, `/badblood`, `/alienarcadium`, `/prison` — per-map detail cards.
- `/leaderboard <stat>` — paginated leaderboard for any tracked stat (top 500).
- `/rankings <player>` — a player's stats that rank in the top 100.
- `/kills <player>` / `/bosskills <player>` — mob and boss kill breakdowns.

## Stack

- Node.js + [discord.js](https://discord.js.org/)
- [better-sqlite3](https://github.com/WiseLibrary/better-sqlite3) for storage
- [@napi-rs/canvas](https://github.com/Brooooooklyn/canvas) for image cards

## Hypixel API usage

The bot is built to respect Hypixel's API rules:

- Player data is cached for 5 minutes per UUID (mirroring Hypixel's own cache);
  repeat lookups within that window are served from the local database instead
  of calling the API.
- `RateLimit-Remaining` / reset headers are read and the bot stops calling the
  API as the limit approaches, falling back to cached data.
- Leaderboards are computed entirely from the local database and never iterate
  the API per-player.
- A per-user command cooldown limits request bursts.

## Setup

```bash
npm install
cp .env.example .env      # then fill in your tokens/keys
node deploy-commands.js   # register slash commands (add --global to publish)
node index.js             # start the bot
```

## Configuration

See `.env.example` for the required environment variables. The SQLite database
is created automatically under `data/` on first run.
