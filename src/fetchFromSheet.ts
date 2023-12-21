interface Response {
  status: "done" | "error";
  data?: unknown[][];
  error?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function doPost(
  e: GoogleAppsScript.Events.DoPost,
): GoogleAppsScript.Content.TextOutput {
  const response: Response = { status: "done" };

  try {
    const timestamp = Date.now();
    const parameter = e.parameter;

    Logger.log(`${timestamp} ${JSON.stringify(parameter)}`);

    if (parameterNames.some((name) => !parameter[name])) {
      throw new Error(`Invalid parameter.`);
    }

    const type = parameter.type;
    const config = configs[type];

    if (!config) {
      throw new Error(`Invalid type.`);
    } else if (timestamp > new Date(config.expiryDate).getTime()) {
      throw new Error(`This form has expired.`);
    }

    const props = PropertiesService.getScriptProperties().getProperties();
    const checkCode = props[`CHECK_CODE_${type}`];
    const secret = props.RECAPTCHA_SECRET;
    const sheetId = props[`SPREADSHEET_ID_${type}`];

    if (!checkCode || !secret || !sheetId) {
      throw new Error(`Invalid script properties.`);
    } else if (parameter.code !== checkCode) {
      throw new Error(`Invalid code.`);
    }

    const spreadSheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadSheet.getSheetByName(config.sheetName);

    if (!sheet) {
      throw new Error(`Sheet not found.`);
    }

    response.data = filterColumn({
      data: sheet.getDataRange().getValues().slice(1),
      filterIndex: config.filterIndex,
      filterName: parameter.name,
      targetIndexes: config.targetIndexes,
    });
  } catch (error) {
    Logger.log(`Error: ${error.message}`);
    response.status = "error";
    response.error = error.message;
  }

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
