# Gas Fetch From Sheet

A Google Apps Script (GAS) project that provides a web API to fetch and filter data from Google Sheets based on configurable parameters.

## Overview

This project creates a web API endpoint that can retrieve specific data from Google Sheets by filtering rows based on a column value and returning only the specified columns. The configuration is managed through a separate config sheet, making it flexible and reusable for different data sources.

## Features

- 🔍 **Filter data** from Google Sheets based on column values
- 📊 **Retrieve specific columns** from filtered results
- ⚙️ **Configurable** through a separate config sheet
- 🌐 **Web API** accessible via HTTP GET requests
- 🔧 **TypeScript** support with proper type definitions
- 📝 **Error handling** with structured JSON responses

## API Usage

### Endpoint

```
GET https://script.google.com/macros/s/{SCRIPT_ID}/exec?type={TYPE}&value={VALUE}
```

### Parameters

- `type`: The configuration type to use (defined in the config sheet)
- `value`: The value to filter by

### Response Format

**Success Response:**
```json
{
  "result": "done",
  "data": [
    ["column1_value", "column2_value", "..."],
    ["another_row", "another_value", "..."]
  ]
}
```

**Error Response:**
```json
{
  "result": "error",
  "error": "Error message description"
}
```

## Setup

### Prerequisites

- Google Apps Script project
- Google Sheets with data to query
- Google Sheets with configuration data

### Script Properties

Set the following script property in your GAS project:

- `SPREADSHEET_ID_CONFIG`: The ID of the spreadsheet containing your configuration

### Configuration Sheet Setup

Create a Google Sheet with a "config" tab containing the following columns:

| expired  | type     | sheetId  | sheetName  | filterHeader  | retrieveHeaders |
|----------|----------|----------|------------|---------------|-----------------|
| ☐        | type     | sheetId  | sheetName  | filterHeader  | retrieveHeaders |
| ☐        | your_type| sheet_id | sheet_name | filter_column | column1,column2,column3 |

### Deployment

1. Clone or copy the source code to your Google Apps Script project
2. Set up the configuration sheet and script properties
3. Deploy the script as a web app
4. Set permissions as needed

## Development

### Project Structure

```
src/
├── appsscript.json    # GAS configuration
├── doGet.ts          # Main entry point for HTTP GET requests
├── getConfig.ts      # Configuration retrieval logic
├── filter.ts         # Data filtering functionality
└── getIndexes.ts     # Helper for column index mapping
```

### Scripts

```bash
# Format code
npm run format

# Format and write changes
npm run format:write

# Lint code
npm run lint

# Lint and fix issues
npm run lint:write

# Check code (format + lint)
npm run check

# Check and fix all issues
npm run check:write
```

### Dependencies

- **Runtime**: Google Apps Script V8 runtime
- **Development**: TypeScript, Biome (formatter/linter)
- **Types**: @types/google-apps-script

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run check:write` to format and lint
5. Submit a pull request
