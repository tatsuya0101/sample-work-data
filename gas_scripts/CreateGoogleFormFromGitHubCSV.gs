// GitHubのtemplatesに保管されているcsvのカラムからGoogleフォームを作成するGASスクリプト
// 設定する必須変数
//.   - [owner] : GitHubのアカウント
//.   - [repo]  : リポジトリ名

// グローバル変数定義
const owner = 'XXXXXXX'; // ユーザー名
const repo = 'XXXXXXXX'; // リポジトリ名


const path = 'templates'; // フォルダ
const branch = 'main'; // ブランチ名 
// テンプレート指定
const templateSpreadsheetId = "XXXXXXXXXXXX";


// SSにボタン追加
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('DW機能')
      .addItem('フォーム作成', 'createForm')
      .addToUi();
}

function createForm() {
 
  // GitHub API を使って templates 配下のファイル一覧を取得
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  Logger.log(url)
  const options = {
    muteHttpExceptions: true,
  };
  const response = UrlFetchApp.fetch(url, options);

  // エラー処理
  if (response.getResponseCode() !== 200) {
    Logger.log('Error fetching file list from GitHub: ' + response.getContentText());
    return;
  }

 // ファイル一覧を解析
  const files = JSON.parse(response.getContentText());
  if (!Array.isArray(files)) {
    Logger.log('Error: Invalid response from GitHub API. Expected an array.');
    return; 
  }
  const fileNames = files.map(file => file.name);

  // ユーザーにファイルを選択させる
  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt(
    'データ収集するGoogleフォームの雛形を選択してください',
    fileNames.join('\n')+'\n\n参照先 :'+url,
    ui.ButtonSet.OK_CANCEL
  );

  // OKボタンが押された場合
  if (result.getSelectedButton() == ui.Button.OK) {
    // 選択されたファイル名を取得
    const selectedFileName = result.getResponseText();
    const subFileName = selectedFileName.substring(0, selectedFileName.length - 4);
    Logger.log(selectedFileName)
    Logger.log(subFileName)

    // 選択されたファイルが存在するかどうかを確認
    if (!fileNames.includes(selectedFileName)) {
      ui.alert('選択されたファイルが見つかりません。');
      return;
    }

    // [def] return : GoogleForm, 説明: XXXXX
    const form = getFormInputFromGithub(selectedFileName, subFileName)

    const formUrl = form.getPublishedUrl();
    const editUrl = form.getEditUrl();
    const formId = form.getId();
    
    // ログにURLを表示
    Logger.log('公開URL: ' + formUrl);
    Logger.log('編集URL: ' + editUrl);
    Logger.log('フォームID: ' + formId); 

    // [def] return:SpreedSheet, 説明: Googleフォームのスプレッドシート連携先変更 + GASスクリプト挿入
    newss = createAndLinkSS(formId, subFileName);
    const newssurl = newss.getUrl()
    Logger.log('スプレッドシートのURL>>>>>: ' + newssurl);

    // [def] return: - , 説明: スプレッドシートに書き込み
    writeUrlToSheet(formUrl, editUrl, newssurl);

    // ポップアップを表示
    SpreadsheetApp.getUi().alert('データ収集用のGoogleフォーム作成完了');
  }
}

function getFormInputFromGithub(selectedFileName, subFileName) {
  // GitHub API を使って CSV ファイルを取得
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/templates/${selectedFileName}?ref=${branch}`;
  Logger.log(url)
  const options = {
    muteHttpExceptions: true,
  };
  const response = UrlFetchApp.fetch(url, options);
  // エラー処理
  if (response.getResponseCode() !== 200) {
    Logger.log('Error fetching CSV file from GitHub: ' + response.getContentText());
    return null;
  }

  // CSV データを解析
  const content = JSON.parse(response.getContentText()).content;
  const csvData = Utilities.newBlob(Utilities.base64Decode(content)).getDataAsString();

  // CSV データを配列に変換
  const data = Utilities.parseCsv(csvData);

  // Google フォームを作成
  const form = FormApp.create(subFileName + '_フォーム');

  // フォームに質問を追加 (ID, 名称, 緯度, 経度, 電話番号)
  const headers = data[0]; // ヘッダー行
  headers.forEach(header => {
    form.addTextItem().setTitle(header);
  });
  return form;
}


function createAndLinkSS(formId, subFileName) {
  // フォームを取得します。
  const form = FormApp.openById(formId);

  //[def] return:SpreedSheet, 説明: 新しいスプレッドシートを作成
  const spreadsheet = createNewSpreadsheetWithGAS(subFileName);

  // フォームの回答送信先を新しいスプレッドシートに設定します。
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());
  return spreadsheet;
}



function createNewSpreadsheetWithGAS(subFileName) {
  const templateSpreadsheet = SpreadsheetApp.openById(templateSpreadsheetId);
  // 新しいスプレッドシートを作成 (コピー)
  const newSpreadsheet = templateSpreadsheet.copy(subFileName + '_サブマスター');
  // 新しいスプレッドシートのURLを取得
  return newSpreadsheet;
}

function writeUrlToSheet(url, editUrl, newssurl) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('URL一覧');
  if (!sheet) {
    sheet = ss.insertSheet('URL一覧');
  }
  var lastRow = sheet.getLastRow();
  var data = [['No', '用途', 'URL'], [1, '公開用', url], [2, '編集用',editUrl], [3, 'スプレッドシート',newssurl]];
  Logger.log(data)
  sheet.getRange(lastRow + 1, 1, 4, 3).setValues(data);

}
