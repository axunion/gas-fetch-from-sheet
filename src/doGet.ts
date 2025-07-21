type GetSuccessResponse = {
	result: "done";
	data: unknown[];
};

type GetErrorResponse = {
	result: "error";
	error: string;
};

type GetResponse = GetSuccessResponse | GetErrorResponse;

function _doGet() {
	const e = { parameter: { type: "", name: "" } };
	const result = doGet(e as unknown as GoogleAppsScript.Events.DoGet);
	console.log(result.getContent());
}

function doGet(
	e: GoogleAppsScript.Events.DoGet,
): GoogleAppsScript.Content.TextOutput {
	let response: GetResponse;

	try {
		const type = e.parameter.type;
		const name = e.parameter.name;

		if (!type || !name) {
			throw new Error("Invalid parameter.");
		}

		const properties = PropertiesService.getScriptProperties().getProperties();
		const configSheetId = properties.SPREADSHEET_ID_CONFIG;

		if (!configSheetId) {
			throw new Error("Invalid script properties.");
		}

		const config = getConfig(configSheetId, type);
		const ss = SpreadsheetApp.openById(config.sheetId);
		const sheet = ss.getSheetByName("Data");

		if (!sheet) {
			throw new Error("Sheet not found.");
		}

		const sheetData = sheet.getDataRange().getValues();
		const row = sheetData[0];

		response = {
			result: "done",
			data: filter({
				rows: sheetData.slice(1),
				columnIndex: getIndexes({ row, names: [config.filterHeader] })[0],
				filterValue: name,
				retrieveIndexes: getIndexes({ row, names: config.retrieveHeaders }),
			}),
		};
	} catch (error) {
		response = { result: "error", error: error.message };
	}

	return ContentService.createTextOutput(JSON.stringify(response));
}
