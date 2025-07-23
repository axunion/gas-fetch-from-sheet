type Config = {
	sheetId: string;
	sheetName: string;
	filterHeader: string;
	retrieveHeaders: string[];
};

function _getConfig(): void {
	const properties = PropertiesService.getScriptProperties().getProperties();
	const config = getConfig(properties.SPREADSHEET_ID_CONFIG, "");
	console.log(config);
}

function getConfig(sheetId: string, type: string): Config {
	const ss = SpreadsheetApp.openById(sheetId);
	const sheet = ss.getSheetByName("config");

	if (!sheet) {
		throw new Error("Config not found.");
	}

	const data = sheet.getDataRange().getValues();
	const item = data.slice(1).find((row) => !row[0] && row[1] === type);

	if (!item) {
		throw new Error("Specified type not found.");
	}

	return {
		sheetId: item[2].trim(),
		sheetName: item[3].trim(),
		filterHeader: item[4].trim(),
		retrieveHeaders: item[5].split(",").map((v: string) => v.trim()),
	};
}
