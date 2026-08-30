# GAS Fetch From Sheet

Simple Google Apps Script (GAS) web endpoint that reads Google Sheets using a config sheet. TypeScript source, deployed with `clasp`.

## Key Features

- Filter rows by a header value
- Return only specific columns
- Central config sheet (no code change for new datasets)
- Clean JSON response (success or error)
- TypeScript + Biome for formatting & linting

## How It Works

1. A GET request calls `doGet`.
2. The script reads a config row (by `type`).
3. It opens the target sheet, finds column indexes, filters rows, and returns selected cells.

## API

Endpoint pattern:

```
GET https://script.google.com/macros/s/{SCRIPT_ID}/exec?type={TYPE}&value={VALUE}
```

Query parameters:

| Name | Required | Description |
|------|----------|-------------|
| `type` | Yes | Key that selects a config row in the config sheet |
| `value` | Yes | Exact cell value to match in the filter column |

Responses:

Success:
```json
{
  "result": "done",
  "data": [["col1", "col2"], ["row2col1", "row2col2"]]
}
```

Error:
```json
{ "result": "error", "error": "Error message" }
```

## Configuration

You need two spreadsheets (they can be the same file):

1. Config spreadsheet (its ID stored in a Script Property)
2. Target data spreadsheet(s)

In the config spreadsheet create a sheet named `config` with columns:

| expired | type | sheetId | sheetName | filterHeader | retrieveHeaders |
|---------|------|---------|-----------|--------------|-----------------|
| (blank or ☑) | key_for_api | target_sheet_id | SheetTabName | HeaderToFilter | colA,colB,colC |

Rules:

- Use an empty `expired` cell for active rows (any non-empty value marks it ignored)
- `type` must be unique
- `retrieveHeaders` is a comma list (no spaces or with spaces—both trimmed)

Script Property to set (AppScript UI: Project Settings > Script properties):

| Name | Value |
|------|-------|
| `SPREADSHEET_ID_CONFIG` | The config spreadsheet ID |

## Build & Deploy (with clasp)

Prerequisites:

- Node 18+
- pnpm
- Google account
- `clasp` (installed as shown below)

Steps (new project):

```bash
pnpm install                # install deps (includes types & biome)
pnpm build                  # compile to dist/
pnpm add -g @google/clasp   # install clasp (if not installed)
clasp login                 # browser auth (first time only)
clasp create --type webapp --title "GAS Fetch From Sheet" --rootDir dist
```

The previous command creates `.clasp.json` pointing to the Apps Script project and sets `rootDir` to `dist` so only build output is pushed.

Now push code (after every build):

```bash
pnpm build
clasp push
```

Create a version & deploy as Web App (first time):

```bash
clasp deploy --description "v1 web" --web-app
```

If `--web-app` is not available in your `clasp` version, do this instead:
1. `clasp version "v1"`
2. Open the Apps Script UI > Deploy > New deployment > Type: Web app
3. Set access level (e.g. Anyone with the link)

Subsequent updates:

```bash
pnpm build
clasp push
clasp version "update"
clasp deploy --description "update"  # or update deployment in UI
```

Set Script Property (once): Apps Script UI > Project Settings > Script properties:

| Name | Value |
|------|-------|
| `SPREADSHEET_ID_CONFIG` | Your config sheet ID |

After deploy, note the Web App URL (`.../exec`).

Alternative (without clasp): Manually copy files from `dist/` into the Apps Script editor; then deploy via UI.

Note: Local run of `doGet` is not practical because it calls GAS services. Test via HTTP after deploy.

## Quick Test

```bash
curl "https://script.google.com/macros/s/{SCRIPT_ID}/exec?type=my_type&value=SomeValue"
```

Expect JSON with `result` = `done` or `error`.

## Project Structure

```
src/
  appsscript.json   # GAS manifest (copied to dist)
  doGet.ts          # Entry: validates params, orchestrates flow
  getConfig.ts      # Reads config sheet
  filter.ts         # Filters rows + extracts columns
  getIndexes.ts     # Maps header names to column indexes
```

Build output: `dist/` (created after `pnpm build`).

## Tech

- Google Apps Script V8 runtime
- TypeScript 7
- Biome (format + lint)
- `@types/google-apps-script` for typings

Requires Node 18+ and pnpm.

## Error Cases (Examples)

| Situation | Error message |
|-----------|---------------|
| Missing `type` or `value` | `Invalid parameter.` |
| Missing script property | `Invalid script properties.` |
| Config row not found | `Specified type not found.` |
| Target sheet missing | `Sheet not found.` |
