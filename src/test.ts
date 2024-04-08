// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _doPost() {
  const testEventData = {
    postData: {
      contents: JSON.stringify({
        type: "202402",
        name: "test",
        code: "0240",
      }),
    },
  };

  const result = doPost(testEventData as GoogleAppsScript.Events.DoPost);
  Logger.log(result.getContent());
}
