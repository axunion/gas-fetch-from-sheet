type Config = {
  dueDate: Date;
  sheetId: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _getConfig(): void {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const config = getConfig(properties.SPREADSHEET_ID_CONFIG, "");
  console.log(config);
}

function getConfig(sheetId: string, sheetName: string): Config {
  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error(`Config not found.`);
  }

  const data = sheet.getDataRange().getValues();

  return {
    dueDate: data[0][0],
    sheetId: data[1][0],
  };
}
