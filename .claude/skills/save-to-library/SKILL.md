# Save to Library

**Trigger**: User says "save to library", "save that to the library", "add to library", or uses `/save-to-library`

When triggered, save the most recently created or discussed Remotion composition to the shared library at `/Users/travis.wilber/Remotion/remotion-library/`.

## Steps

### 1. Identify the composition
Ask the user if it's not clear:
- Which `.jsx` file (or composition name)?
- What series? (GTM Explained, Revenue Management, Campaign Intent, Partners GTM, or new)
- What type? (radial, grid, tree, panels, or describe it)
- What prompt was used to create it? (paste or summarize)

### 2. Copy the .jsx file
Copy the source file to:
```
/Users/travis.wilber/Remotion/remotion-library/examples/<FileName>.jsx
```

### 3. Render a preview clip
Run the Remotion CLI to render a short preview at half resolution:
```bash
cd /Users/travis.wilber/Remotion && npx remotion render <CompositionId> remotion-library/previews/<FileName>.mp4 --frames=0-120 --scale=0.5
```
If the composition is longer than 120 frames, use `--frames=0-150` or the full duration.
If rendering fails, note it — the entry can still be saved without a preview.

### 4. Update manifest.json
Read `/Users/travis.wilber/Remotion/remotion-library/manifest.json` and append a new entry to the `compositions` array:

```json
{
  "id": "<kebab-case-title>",
  "title": "<Human Readable Title>",
  "series": "<series name>",
  "type": "<radial|grid|tree|panels|other>",
  "tags": ["<relevant>", "<tags>"],
  "description": "<one sentence describing what the scene shows>",
  "duration": "<~N frames @ 30fps>",
  "compositionId": "<ExportedFunctionName>",
  "file": "examples/<FileName>.jsx",
  "preview": "previews/<FileName>.mp4",
  "prompt": "<the prompt or description that produced this composition>",
  "addedBy": "<user's name>",
  "addedAt": "<YYYY-MM-DD>"
}
```

Use today's date for `addedAt`. Use the git config user name or ask the user for `addedBy`.

### 5. Update inlined MANIFEST_DATA in index.html
The microapp at `remotion-library/index.html` inlines the manifest as a JS constant so it works under ZI Chat's strict CSP. After updating `manifest.json`, also update the `MANIFEST_DATA` const in `index.html`.

Use a Python script to do the replacement safely (the line is very long):
```bash
python3 -c "
import json
with open('remotion-library/manifest.json') as f:
    manifest = json.load(f)
with open('remotion-library/index.html') as f:
    html = f.read()
# Replace the MANIFEST_DATA constant value
import re
new_json = json.dumps(manifest, separators=(',', ':'))
html = re.sub(r'const MANIFEST_DATA = \{.*?\};', f'const MANIFEST_DATA = {new_json};', html, count=1)
with open('remotion-library/index.html', 'w') as f:
    f.write(html)
print('Done')
"
```

### 6. Deploy to GitHub Pages
Commit the updated files to `main`, then sync `remotion-library/` to the `gh-pages` branch so the live site at **https://twilberzi.github.io/remotion/** updates automatically:

```bash
# Commit to main
cd /Users/travis.wilber/Remotion
git add remotion-library/
git commit -m "Add <Title> to library"
git push origin main

# Sync to gh-pages
cp -r remotion-library/. /tmp/gh-pages-deploy/
cd /tmp/gh-pages-deploy
git add -A
git commit -m "Add <Title> to library"
git push origin gh-pages
cd /Users/travis.wilber/Remotion
```

No zip upload needed — the live site updates within ~30 seconds of the gh-pages push.

### 7. Confirm
Tell the user:
- ✓ File saved to `remotion-library/examples/`
- ✓ Preview rendered to `remotion-library/previews/`
- ✓ Added to `manifest.json` and `index.html` as `"<title>"`
- ✓ Deployed to https://twilberzi.github.io/remotion/
- The zip at `remotion-library.zip` is only needed for the ZI Chat microapp — re-upload it only if the microapp URL is being updated.

## Notes
- **Live URL**: https://twilberzi.github.io/remotion/ — this is the always-current version
- **ZI Chat microapp**: Uses the zip; only needs a re-upload if you change the microapp config. The GitHub Pages URL can be iframed directly if ZI Chat allows it.
- The `examples/` and `previews/` paths are relative to `remotion-library/` — this is what the microapp's HTML references.
- If the composition uses assets from `public/`, note that in the description so viewers know what's needed to run it locally.
- Never overwrite an existing entry — generate a unique `id` if there's a name collision (e.g., append `-v2`).
- The `/tmp/gh-pages-deploy` directory persists between saves. If it gets stale, re-clone: `git clone --branch gh-pages https://github.com/twilberzi/remotion.git /tmp/gh-pages-deploy`
