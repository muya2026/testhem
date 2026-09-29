# testhem × Supabase — fresh setup, click by click

This guide is for a **brand-new Supabase project**. It assumes there are no existing testhem users, rooms, or database objects. There is one SQL file to run: `supabase-schema.sql`. It creates the `testhem_*` room/mark tables and RPC functions used by this version of the site.

> **Never put a Supabase secret key or database password in the website.** The only key used in `config.js` is the browser-safe **publishable** key beginning `sb_publishable_`.

## What you will need

- A GitHub login with access to [muya2026/testhem](https://github.com/muya2026/testhem).
- A Supabase login.
- About 10 minutes.
- Two browser tabs/devices for the final multiplayer test.

No Supabase Auth users or account sign-ups are needed for players.

---

## 1. Create a new Supabase project

1. Open [supabase.com/dashboard](https://supabase.com/dashboard) and sign in.
2. Select your organization. If you do not have one, use **New organization** and follow the prompts.
3. Click **New project**.
4. Select your organization and enter a project name, for example **testhem**.
5. Create a strong **Database Password**. Save it in a password manager. This password is for database administration only; **do not paste it into `config.js`**.
6. Choose a region near your players. For Bangladesh, choose the closest available South Asian region; the chosen database region cannot usually be changed later without moving the project.
7. Select the free plan if it fits your usage, then click **Create new project**.
8. Wait until the project status says it is ready/healthy.

## 2. Create the tables and game functions

1. In the new Supabase project, open **SQL Editor** from the left navigation.
2. Click **New query**.
3. Open the GitHub file [`supabase-schema.sql`](https://github.com/muya2026/testhem/blob/main/supabase-schema.sql) in another tab.
4. Click **Raw** near the top of the file. Select all the SQL text and copy it.
5. Return to the Supabase SQL Editor. Click inside the query editor, select any placeholder text, and paste the complete file.
6. Click **Run**.
7. Wait for the green **Success** result. If the editor shows an error, stop and copy the full error message before retrying—do not run random snippets.

This one script creates the room table (`testhem_rooms`), the opt-in public wall table (`testhem_marks`), and the `testhem_*` RPC functions. Row Level Security is enabled; the browser uses the restricted RPC functions rather than direct table access.

## 3. Copy the project URL and publishable key

**Skip the Connect dialog for these values.** In the current Supabase dashboard, the URL and API key are in separate places:

### Project URL

1. In your project’s left sidebar, open **Integrations**.
2. Click **Data API**.
3. Copy the **Project URL / API URL** shown on that page. It looks like `https://abcdefghijklmnop.supabase.co`.
4. Copy only the base URL. Do not add `/rest/v1`, and do not use the database connection string.

If the Data API page is not available in your layout, read the **Project ref** from the dashboard address. It is the part after `/dashboard/project/` and before the next `/`. For the standard Supabase domain, the URL is `https://PROJECT_REF.supabase.co`.

### Publishable key

1. In the left sidebar, click **Project Settings** (gear icon).
2. Click **API Keys**.
3. Find **Publishable and secret API keys** / **Publishable keys**.
4. Click **Copy** beside the `default` publishable key beginning `sb_publishable_`.
5. If there is no publishable key listed, use the **Create new API key** control on that page and create a **Publishable** key. Copy that key.

Do not copy a key beginning `sb_secret_`, and do not copy a `service_role` key. Those are server-only secrets and must never appear in GitHub Pages or browser code.

Supabase documents the Project URL under **Integrations → Data API** and keys under **Settings → API Keys**: [Data API](https://supabase.com/docs/guides/api) · [API keys](https://supabase.com/docs/guides/getting-started/api-keys).

## 4. Put the safe values into `config.js`

1. Open [github.com/muya2026/testhem](https://github.com/muya2026/testhem).
2. Click **Code** → **Codespaces** → open the existing Codespace on `main` (or create one).
3. In the left Explorer, click `config.js`.
4. Replace the empty `supabaseUrl` and `supabasePublishableKey` values with your copied URL and publishable key. Keep the quotes and punctuation. It should look like this:

   ```js
   window.TESTHEM_CONFIG = {
     supabaseUrl: 'https://YOUR_PROJECT_REF.supabase.co',
     supabasePublishableKey: 'sb_publishable_YOUR_PUBLIC_KEY',
     supabaseAnonKey: ''
   };
   ```

5. Do not paste the database password, `sb_secret_...`, or `service_role` key into any line.
6. Save the file with **Ctrl+S** (Windows/Linux) or **Cmd+S** (Mac).
7. In the Codespaces terminal, save and publish the change:

   ```bash
   git add config.js
   git commit -m "Connect testhem to Supabase"
   git push origin main
   ```

   If Git says there is nothing to commit, check that you saved `config.js`. If push says **fetch first**, run `git pull --rebase origin main` and then retry `git push origin main`. Do not force-push.

8. In the GitHub repository, click **Actions**. Wait for the latest **Pages build and deployment** job to finish with a green check. Then refresh [the live site](https://muya2026.github.io/testhem/).

## 5. Test the room on two devices

1. Open the live site in your regular browser. Enter your display name and click **Save Name**.
2. Choose one of the seven game portals, then choose **Far Apart**.
3. Click **Create Private Room**. If the page reports missing Supabase settings, confirm the Pages deployment included the saved `config.js`.
4. Click **Copy Invite Link**.
5. Open an incognito/private window or a second device. Paste the **entire** invite link, enter a different name, and click **Join Room**.
6. Confirm both names appear in the lobby. On the host device, click **Start the Round**.
7. Submit an answer on each device. The other player's answer should stay hidden until reveal. Finish voting on each device and check that the reveal and scorecard appear.
8. Use the **Make a Branded Scorecard PNG** button to save/share the round recap. The image includes player names and scores but not answers.
9. Repeat with another portal to check a non-Psych mode.

## 6. The Trashbin consent check

1. On the live site, click **Mark Wall**.
2. Enter a display name and short mark.
3. Read and check the consent box only if you agree that the name and mark will be public to anyone visiting the site.
4. Click **Drop My Mark**. You can close the wall without posting; merely opening it never submits anything.

The mark wall is public by design. Do not post email addresses, phone numbers, locations, or anything you do not want displayed publicly. No email or Supabase account is collected.

## If something fails

- **“Add the Supabase project URL and publishable key”** — `config.js` is blank, misspelled, or not deployed. Check the two values, save, push, and wait for Pages Actions to finish.
- **HTTP 404 / function not found** — the SQL did not run in this project. Repeat section 2 and verify the green **Success** result.
- **401 / invalid key** — use the correct Project URL and the `sb_publishable_...` key. Do not use the dashboard URL, database password, or secret key.
- **Room opens but join fails** — paste the full invite URL, including everything after `#join=`. Treat it like a password and send it only to players.
- **Old page after a push** — check **Actions** for a green Pages deployment, then hard-refresh with **Ctrl+Shift+R** / **Cmd+Shift+R** or open a private tab.
- **Supabase SQL error** — keep the full message and share it before rerunning anything. The schema is intended for a new project, as described above.
