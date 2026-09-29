# testhem — GitHub, Codespaces, Pages, and Supabase

The public repository already exists at **https://github.com/muya2026/testhem**. This guide updates that repository with the complete site bundle. The project is a static website: no build command, Node install, or database is needed for the seven same-room games.

## 1. Update the existing repository from Codespaces

1. Download **`testhem-github-pages.zip`** from the project files.
2. Open [github.com/muya2026/testhem](https://github.com/muya2026/testhem).
3. Select **Code → Codespaces → Create codespace on main**. If there is already a Codespace for this repository, it is fine to reopen it.
4. In the Codespaces Explorer, upload `testhem-github-pages.zip` into the repository root (the folder containing `.git`). Use the Explorer **… → Upload** option or drag the ZIP into the Explorer.
5. Open **Terminal → New Terminal**, confirm the ZIP is in the current repository folder, and extract it:

   ```bash
   pwd
   ls
   unzip -o testhem-github-pages.zip -d .
   ```

   If `unzip` is unavailable, use Python:

   ```bash
   python3 -m zipfile -e testhem-github-pages.zip .
   ```

6. Confirm `index.html`, `style.css`, `app.js`, `config.js`, `supabase-schema.sql`, `supabase-guestbook-migration.sql`, `README.md`, `LICENSE`, and `assets/testhem-cover.svg` are at the repository root or their stated paths. Remove the uploaded ZIP so GitHub Pages does not publish the archive:

   ```bash
   rm testhem-github-pages.zip
   ```

7. Commit and push the site to the existing `main` branch:

   ```bash
   git status
   git add -A
   git commit -m "Rebrand project as testhem and add public mark wall"
   git push origin main
   ```

   If Git asks for your commit identity, set it in this Codespace and retry:

   ```bash
   git config --global user.name "Muya"
   git config --global user.email "YOUR_GITHUB_EMAIL"
   ```

   GitHub may ask you to authenticate the Codespace before it can push.

## 2. Enable GitHub Pages

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Choose **main** and **/(root)**, then **Save**.
4. Wait for the workflow in **Actions** to finish. The expected site address is:

   **https://muya2026.github.io/testhem/**

5. Test that link. Future commits pushed to `main` will trigger another Pages deployment.

### Optional Codespaces preview

From the Codespaces terminal, run `python3 -m http.server 8000 --bind 0.0.0.0`, then open the forwarded port 8000 preview. Stop the server with **Ctrl+C**.

## 3. GitHub About details and author credit

The project’s README already includes the author byline **[@muya2026](https://github.com/muya2026)**, a wide SVG cover, and a prominent **Play Now** badge pointing to the expected Pages address.

To fill the repository’s **About** box, open the gear icon beside **About** on the repository page and use:

- **Description:** `A living 3D party-game observatory: seven social games, orbiting portals, pass-and-play rounds, and an opt-in public mark wall.`
- **Website:** `https://muya2026.github.io/testhem/` (after Pages is deployed)
- **Topics:** `party-games`, `social-games`, `webgl`, `3d`, `supabase`, `github-pages`, `guestbook`, `javascript`
- **Social preview:** upload `assets/testhem-cover.png` (1280 × 640).

## 4. Add the public Trashbin mark wall to the Supabase project

Local game play does not need Supabase. Supabase is optional for online **Psych!** rooms and is required for the public guestbook, called **The Trashbin** in the site.

### If the room database is already set up

1. Open the existing Supabase project’s **SQL Editor → New query**.
2. Open `supabase-guestbook-migration.sql` from the repository, copy the entire file, paste it into the query editor, and click **Run**.
3. This adds `testhem_marks` plus `testhem_get_marks` and `testhem_leave_mark` RPC functions. It does not rename or delete the existing `afterlight_rooms` table or its `afterlight_*` RPC functions; those existing names are intentionally retained so the existing Psych! room setup keeps working.

### If setting up a brand-new Supabase database

Run the complete `supabase-schema.sql` file in **SQL Editor → New query**. The full schema contains both the online-room functions and the Trashbin guestbook migration.

### Connect the website to Supabase

1. Copy the Supabase **Project URL** and **publishable key** (`sb_publishable_...`) from the project’s Connect/API keys page.
2. Edit `config.js` in Codespaces and paste them into the existing fields:

   ```js
   window.TESTHEM_CONFIG = {
     supabaseUrl: 'https://YOUR_PROJECT_REF.supabase.co',
     supabasePublishableKey: 'sb_publishable_YOUR_PUBLIC_KEY',
     supabaseAnonKey: ''
   };
   ```

   Keep the compatibility line already present at the bottom of `config.js`:

   ```js
   window.AFTERLIGHT_CONFIG = window.TESTHEM_CONFIG;
   ```

3. Save, commit, and push the change:

   ```bash
   git add config.js
   git commit -m "Connect testhem to Supabase"
   git push origin main
   ```

4. Wait for Pages to redeploy. Open the site and select **Mark Wall**. Submit a test mark only after checking the explicit public-consent box.
5. For online Psych!, choose that game, select **Far Apart**, and create a private room. Open its full invite link in another browser/device and join with a different name.

This frontend supports a legacy `anon` JWT in `supabaseAnonKey` as a fallback, but use a publishable key for a new deployment. Supabase describes publishable keys as browser-safe and secret keys as server-only; legacy `anon`/`service_role` keys are scheduled for deprecation by the end of 2026 ([current Supabase API-key guidance](https://supabase.com/docs/guides/getting-started/api-keys)). The publishable key is not a password. **Never put an `sb_secret_...` or `service_role` key into `config.js`, GitHub Pages, or any frontend file.**

## 5. What The Trashbin stores and how to moderate it

- A visitor chooses a display name and a short mark, then explicitly checks consent before posting. Nothing is posted simply by opening the wall.
- Submitted names and marks are public to everyone who visits the website. The form asks people not to post contact details. There is no email or account collection.
- The SQL enables RLS, blocks direct browser reads/writes to `testhem_marks`, and exposes only the two guestbook RPC functions. The page renders mark text as plain text, not executable HTML.
- A lightweight cap allows at most five marks per saved browser token per hour. This helps casual spam but is **not strong anti-abuse or identity verification**.
- To remove a post, the project owner can delete its row in Supabase **Table Editor → testhem_marks**. Browser visitors are not granted delete access.

## 6. Troubleshooting

- **Site says the wall is not connected:** make sure `supabaseUrl` and `supabasePublishableKey` are filled in, committed, and deployed.
- **RPC function not found / 404:** run `supabase-guestbook-migration.sql` for an existing database, or the full `supabase-schema.sql` for a new one. Make sure the Supabase Data API is enabled.
- **401 / invalid API key:** use the exact project URL and the `sb_publishable_...` key—not the dashboard URL, database password, or secret key.
- **Push rejected:** authenticate the Codespace with GitHub and ensure it is on the repository’s `main` branch.
- **Play Now link is not live yet:** enable Pages, wait for the Pages workflow, and confirm the URL `https://muya2026.github.io/testhem/` opens.
