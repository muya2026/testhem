<div align="center">

![testhem — Seven games in orbit. One crew at the center.](assets/testhem-cover.svg)

# testhem

### Seven games in orbit. One crew at the center.

A living 3D social-game observatory for the stories, bluffs, and inside jokes your group makes together.

[![▶ PLAY NOW](https://img.shields.io/badge/▶%20PLAY%20NOW-ENTER%20TESTHEM-d6ff78?style=for-the-badge&labelColor=07111d)](https://muya2026.github.io/testhem/)

[![GitHub Pages](https://img.shields.io/badge/DEPLOY-GitHub%20Pages-101826?style=flat-square&logo=github)](https://github.com/muya2026/testhem/deployments)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-d6ff78.svg?style=flat-square)](LICENSE)
[![WebGL](https://img.shields.io/badge/3D-WebGL-7db5ff?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)

**Created by [@muya2026](https://github.com/muya2026)**

</div>

---

## A party game that feels like a place

Choose from seven distinct social games in a camera-controlled observatory. Portals move along slow elliptical orbits around a warm central star; their titles stay readable as the scene shifts. Enter a game from the 3D world, or use **Choose a Game** to launch directly from the readable game guide.

Set your name to personalize the observatory and claim player one. Invite friends to pass the device around, or—only for Psych!—create a private Supabase room. If you want, leave a name and a short mark on **The Trashbin**, the opt-in public guestbook.

### The seven games

| Game | The hook |
|---|---|
| **Psych! The Truth Bluff** | Answer honestly or bluff; your friends decide which is real. |
| **Two Truths & a Lie** | Three claims, one lie, and a group trying to spot it. |
| **Would You Rather?** | Pick a side, explain it, then see who knows your choice. |
| **Three Questions** | Give three answers—one is made up. Can the crew catch it? |
| **Question Jar** | Share or pass; vote for the story that surprised you. |
| **Hidden Truth** | Match an anonymous, harmless fact to the friend who shared it. |
| **Read the Room** | Predict the group’s majority and compare your read. |

All seven games work locally for 2–8 players with no account. Thoughtful prompts are optional; any player can pass. The games are conversation starters, not personality tests or diagnoses.

## Leave your mark

**The Trashbin** is an opt-in public mark wall. A visitor chooses a display name and short note, then explicitly consents before posting. Posted marks are visible to anyone who opens the site. No email or account is requested. Keep marks kind and avoid personal contact details. The wall requires the Supabase guestbook migration; local games still work without it.

## Start locally

```bash
python3 -m http.server 8000 --bind 0.0.0.0
```

Open `http://localhost:8000`. No build step is required.

## Publish this repository

The repository name is **testhem**. The complete ZIP and click-by-click Codespaces, GitHub Pages, Supabase, and troubleshooting steps are in [`GITHUB_AND_SUPABASE_SETUP.md`](GITHUB_AND_SUPABASE_SETUP.md).

Expected GitHub Pages URL after deployment:

**https://muya2026.github.io/testhem/**

### Supabase, optional

The online room feature supports **Psych! only**. The public Trashbin guestbook also uses Supabase. For a new database, run all of [`supabase-schema.sql`](supabase-schema.sql). If your project already has the room database, run only [`supabase-guestbook-migration.sql`](supabase-guestbook-migration.sql). Then add the Project URL and `sb_publishable_...` key to [`config.js`](config.js), commit, and push. Never put a Supabase secret or `service_role` key in this public website.

The current SQL uses RLS to block direct browser access to the marks table; the frontend calls limited RPC functions. Guestbook posts are public by design and require opt-in. The browser token’s five-per-hour limit is a lightweight abuse guard, not strong identity verification. Room invite links are bearer invites—share them privately.

## Repository About details

Suggested GitHub About settings:

- **Description:** `A living 3D party-game observatory: seven social games, orbiting portals, pass-and-play rounds, and an opt-in public mark wall.`
- **Website:** `https://muya2026.github.io/testhem/` (after Pages is enabled)
- **Topics:** `party-games`, `social-games`, `webgl`, `3d`, `supabase`, `github-pages`, `guestbook`, `javascript`
- **Social preview:** `assets/testhem-cover.svg`

## Privacy

The player name is stored in this browser so the site can personalize the welcome and prefill local player one. It is not sent to the database in local mode. Guestbook display names and marks are sent only after the explicit consent checkbox is checked. Online Psych! rooms temporarily store names, answers, truth/bluff flags, and votes to run the game. No geolocation is requested and the procedural sky is not an exact astronomical forecast.

---

<sub>Made for curious crews by <a href="https://github.com/muya2026">@muya2026</a> · GPL-3.0</sub>
