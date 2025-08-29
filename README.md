# GAS Fetch From Sheet

Simple Google Apps Script (GAS) Web API to read, filter, and return selected columns from Google Sheets using a config sheet. Written in TypeScript and compiled to plain GAS code.

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

## Build & Deploy

This repo uses TypeScript. Build output is written to `dist/` and includes a copied `appsscript.json`.

1. Install deps:
  ```bash
  npm install
  ```
2. Build TypeScript:
  ```bash
  npm run build
  ```
3. Open Apps Script editor (if using the online editor) and replace/create files with the JS from `dist/` (one file per compiled `.ts`). If you use clasp, you can instead initialize clasp and push:
  ```bash
  # (Optional) if you decide to add clasp later
  npx clasp create --type webapp --title "GAS Fetch From Sheet"
  # copy dist files into the clasp project folder then
  npx clasp push
  ```
4. Set the Script Property `SPREADSHEET_ID_CONFIG`.
5. Deploy: Deploy > New deployment > type Web app.
6. Set access (e.g. Anyone with the link) as needed.

Note: Local execution of `doGet` is not practical because it calls GAS services (SpreadsheetApp, PropertiesService). Testing is done after deployment via HTTP.

## Quick Test

After deploy, call:
```
curl "https://script.google.com/macros/s/{SCRIPT_ID}/exec?type=my_type&value=SomeValue"
```

Expect `{"result":"done", ...}` or an error JSON.

## Project Structure

```
src/
  appsscript.json   # GAS manifest (copied to dist)
  doGet.ts          # Entry: validates params, orchestrates flow
  getConfig.ts      # Reads config sheet
  filter.ts         # Filters rows + extracts columns
  getIndexes.ts     # Maps header names to column indexes
```

Build output: `dist/` (created after `npm run build`).

## Tech

- Google Apps Script V8 runtime
- TypeScript 5
- Biome (format + lint)
- `@types/google-apps-script` for typings

Requires Node 18+ (Biome + recent TypeScript).

## Error Cases (Examples)

| Situation | Error message |
|-----------|---------------|
| Missing `type` or `value` | `Invalid parameter.` |
| Missing script property | `Invalid script properties.` |
| Config row not found | `Specified type not found.` |
| Target sheet missing | `Sheet not found.` |
