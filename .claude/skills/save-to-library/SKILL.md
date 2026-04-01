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

### 5. Confirm
Tell the user:
- ✓ File saved to `remotion-library/examples/`
- ✓ Preview rendered to `remotion-library/previews/`
- ✓ Added to `manifest.json` as `"<title>"`
- Remind them: "Spencer (or anyone) can pull the repo to get the latest library."

## Notes
- The library microapp reads `manifest.json` at load time — the new entry will appear as soon as the app is refreshed or redeployed.
- The `examples/` and `previews/` paths are relative to `remotion-library/` — this is what the microapp's HTML references.
- If the composition uses assets from `public/`, note that in the description so viewers know what's needed to run it locally.
- Never overwrite an existing entry — generate a unique `id` if there's a name collision (e.g., append `-v2`).
