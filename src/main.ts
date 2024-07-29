type Response = {
  result: "done" | "error";
  data?: unknown[];
  error?: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _doGet() {
  const e = { parameter: { type: "0000", name: "test" } };
  const result = doGet(e as unknown as GoogleAppsScript.Events.DoGet);
  console.log(result);
}

function doGet(
  e: GoogleAppsScript.Events.DoGet,
): GoogleAppsScript.Content.TextOutput {
  const response: Response = { result: "done" };

  try {
    const type = e.parameter.type;
    const name = e.parameter.name;

    if (!type || !name) {
      throw new Error(`Invalid parameter.`);
    }

    const properties = PropertiesService.getScriptProperties().getProperties();
    const configSheetId = properties.SPREADSHEET_ID_CONFIG;

    if (!configSheetId) {
      throw new Error(`Invalid script properties.`);
    }

    const config = getConfig(configSheetId, type);

    if (new Date() > config.dueDate) {
      throw new Error(`This form has expired.`);
    }

    const ss = SpreadsheetApp.openById(config.sheetId);
    const sheet = ss.getSheetByName("Data");

    if (!sheet) {
      throw new Error(`Sheet not found.`);
    }

    const sheetData = sheet.getDataRange().getValues();
    const headers = sheetData[0];

    response.data = filter({
      rows: sheetData.slice(1),
      columnIndex: getIndexes(headers, [config.filterHeader])[0],
      filterValue: name,
      retrieveIndexes: getIndexes(headers, config.retrieveHeaders),
    });
  } catch (error) {
    response.result = "error";
    response.error = error.message;
  }

  return ContentService.createTextOutput(JSON.stringify(response));
}
