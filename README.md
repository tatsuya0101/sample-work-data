# データ収集テンプレート
データを収集する際には、下記テンプレートをご活用ください。

## 利用開始までの流れ

1. [[データ収集テンプレート]](https://docs.google.com/spreadsheets/d/1U0nsRC8p9KJnjIwowYBf8E_qyk3APKlJ2zBBxujK5YE/edit?usp=sharing)をクリックし、使用したいシートをコピーする。
2. コピーしたスプレッドシートに対してデータ入力して整備していく
3. データをGoogleフォームを活用して収集したい場合は、下記の「Googleフォームによるデータ収集方法」をご参照ください。

## Googleフォームによるデータ収集方法

- このリポジトリにある「utils/gas-script」フォルダ配下にある「XXXX.gs」をご自身のスプレッドシートの 拡張機能 > Apps Script にあるスクリプトにコピーする
- 保存が完了したら、スプレッドシートをリロードし、「DW機能」> 「Googleフォーム作成」をクリック
- 新規のシートが作成され、そこに収集用のGoogleフォームのリンクがあるので共有してお使いください


---

## ディレクター機能

- ファイル構成
  - CheckFlow.gs >> ShowDirector.html >> CheckFlow.gs(saveSelectedValue()) >> ShowTask.html >>　CheckFlow.gs(processSelectedData()) >> ShowFacility.html >> CheckFlow.gs(decision_facility) >> complete.html
 
## 事業所承認機能
- approval_by_facility.gs
  - getItems() 
  - approve()
  - reject()   
- ShowApproval.html

## Googleフォーム作成機能


