type Config = {
  dueDate: Date;
  sheetId: string;
  filterHeader: string;
  retrieveHeaders: string[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _getConfig(): void {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const config = getConfig(properties.SPREADSHEET_ID_CONFIG, "0000");
  console.log(config);
}

function getConfig(sheetId: string, type: string): Config {
  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = ss.getSheetByName("config");

  if (!sheet) {
    throw new Error(`Config not found.`);
  }

  const data = sheet.getDataRange().getValues();
  const row = data.find((row) => row[0] === type);

  if (!row) {
    throw new Error(`Config not found.`);
  }

  return {
    dueDate: row[1],
    sheetId: row[2].trim(),
    filterHeader: row[3].trim(),
    retrieveHeaders: row[4].split(",").map((v: string) => v.trim()),
  };
}
