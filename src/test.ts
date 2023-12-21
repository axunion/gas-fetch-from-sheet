// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _doPost() {
  const testEventData = {
    parameter: {
      type: "202402",
      name: "test",
      code: "0240",
    },
  } as unknown as GoogleAppsScript.Events.DoPost;

  const result = doPost(testEventData);
  Logger.log(result.getContent());
}
