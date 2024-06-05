type Response = {
  result: "done" | "error";
  data?: unknown[][];
  error?: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function doPost(
  e: GoogleAppsScript.Events.DoPost,
): GoogleAppsScript.Content.TextOutput {
  const response: Response = { result: "done" };

  try {
    const parameter = JSON.parse(e.postData.contents);
    const type = parameter.type;
    const config = configs[type];
    const date = new Date();

    if (!config) {
      throw new Error(`Invalid type.`);
    }

    if (date > new Date(config.dueDate)) {
      throw new Error(`This form has expired.`);
    }

    const props = PropertiesService.getScriptProperties().getProperties();
    const secret = props.RECAPTCHA_SECRET;
    const sheetId = props[`SPREADSHEET_ID_${type}`];

    if (!secret || !sheetId) {
      throw new Error(`Invalid script properties.`);
    }

    const spreadSheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadSheet.getSheetByName("Data");

    if (!sheet) {
      throw new Error(`Sheet not found.`);
    }

    response.data = filter({
      data: sheet.getDataRange().getValues().slice(1),
      filterIndex: config.filterIndex,
      filterName: parameter.name,
      targetIndexes: config.targetIndexes,
    });
  } catch (error) {
    response.result = "error";
    response.error = error.message;
  }

  return ContentService.createTextOutput(JSON.stringify(response));
}
