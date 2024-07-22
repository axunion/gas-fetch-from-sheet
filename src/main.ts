type Response = {
  result: "done" | "error";
  data?: unknown[];
  error?: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _doGet() {
  const e = { parameter: { type: "0000", name: "test", value: "", label: "" } };
  const result = doGet(e as unknown as GoogleAppsScript.Events.DoGet);
  console.log(result);
}

function doGet(
  e: GoogleAppsScript.Events.DoGet,
): GoogleAppsScript.Content.TextOutput {
  const response: Response = { result: "done" };

  try {
    const parameter = JSON.parse(e.parameter.data);
    const type = parameter.type;
    const name = parameter.name;
    const value = parameter.value;
    const label = parameter.label;

    if (!type || !name || !value || !label) {
      throw new Error(`Invalid parameter.`);
    }

    const properties = PropertiesService.getScriptProperties().getProperties();
    const configSheetId = properties.SPREADSHEET_ID_CONFIG;

    if (!configSheetId) {
      throw new Error(`Invalid script properties.`);
    }

    const config = getConfig(configSheetId, type);
    const date = new Date();

    if (date > new Date(config.dueDate)) {
      throw new Error(`This form has expired.`);
    }

    const spreadSheet = SpreadsheetApp.openById(config.sheetId);
    const sheet = spreadSheet.getSheetByName(type);

    if (!sheet) {
      throw new Error(`Sheet not found.`);
    }

    response.data = filter({
      rows: sheet.getDataRange().getValues().slice(1),
      filterHeader: name,
      filterValue: value,
      retrieveHeaders: label,
    });
  } catch (error) {
    response.result = "error";
    response.error = error.message;
  }

  return ContentService.createTextOutput(JSON.stringify(response));
}
