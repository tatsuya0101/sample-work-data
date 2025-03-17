function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('DW機能')
      .addItem('Googleフォーム作成', 'confirmCreateGoogleForm') // 関数名を変更
      .addToUi();
}

function confirmCreateGoogleForm() {
  var ui = SpreadsheetApp.getUi();

  // 確認ダイアログを表示
  var response = ui.alert(
      'Googleフォームを作成しますか？',
      '実行すると、現在のシートに基づいてGoogleフォームが作成されます。',
      ui.ButtonSet.OK_CANCEL);

  // OK ボタンが押された場合のみ処理を実行
  if (response == ui.Button.OK) {
    CreateGoogleForm();
  }
}

function CreateGoogleForm() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var form = FormApp.create(sheet.getName());
  var lastColumn = sheet.getLastColumn();
  Logger.log('last column = '+ lastColumn)

  // カラムの取得
  for (var i = 1; i <= lastColumn; i++) {
    var question = sheet.getRange(1, i).getValue();
    var dataType = sheet.getRange(2, i).getValue();
    var required = sheet.getRange(3, i).getValue();
    var description = sheet.getRange(4, i).getValue();
    Logger.log(question, dataType, required, description)

    // 型がintの場合の制限を追加
    var item = form.addTextItem();
    if (dataType == "int") {
      var validation = FormApp.createTextValidation().requireNumber().build();
      item.setValidation(validation);
    }

    //質問内容、説明文の追加
    item.setTitle(question);
    item.setHelpText(description);

    // requiredのカラムの設定
    if (required == "required") {
      item.setRequired(true);
    }
  }
  // フォームとリンク付けられたスプレッドシートのURLを取得
  // 新しいスプレッドシートを作成し、フォームと関連付け
  var newSpreadsheet = SpreadsheetApp.create("Googleフォームの回答");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, newSpreadsheet.getId());

  var formUrl = form.getPublishedUrl();
  var editUrl = form.getEditUrl();
  var formResponsesUrl = newSpreadsheet.getUrl();

  var urlSheet = ss.getSheetByName("フォームURL");
  if (!urlSheet) {
    urlSheet = ss.insertSheet("フォームURL"); // シートが存在しない場合は作成
  }
  urlSheet.getRange(1, 1).setValue('公開用URL');
  urlSheet.getRange(2, 1).setValue('編集用URL');
  urlSheet.getRange(3, 1).setValue('関連付けられたSS');

  urlSheet.getRange(1, 2).setValue(formUrl); // A1セルに公開URL
  urlSheet.getRange(2, 2).setValue(editUrl); // A2セルに編集URL
  urlSheet.getRange(3, 2).setValue(formResponsesUrl);

  Browser.msgBox("Googleフォームを作成し、URLを「フォームURL」シートに書き込みました。");
}
