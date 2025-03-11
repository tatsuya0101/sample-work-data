# データ収集テンプレート
データを収集する際には、下記テンプレートをご活用ください。2種類のタイプがあり、ユースケースに沿ってご選択ください。

### [1] TypeA 
- 対象 : 手元にあるデータをスプレッドシートにデータ整備したい方
- 下記をクリックし、使用したいシートをコピーしてお使いください。
- [<TypeB>データ収集テンプレート](https://docs.google.com/spreadsheets/d/1rTLe6Ya76OMVyNPpDyjcvtKeqmWCXzRFbmNdThgNv4o/edit?gid=0#gid=0)

#### データ収集手順

- 1. XXXX
- 2. XXXX 


### [2] TypeB 
- 対象: スプレッドシート+Googleフォームを活用してデータ収集を実施したい方
- 下記リンクをクリックし、使用したいシートをコピーしてお使いください。
- Googleフォームを自動生成する機能にGASスクリプトを利用します。「gas_scripts」フォルダにある「CreateGoogleFormFromSS.gs」GASスクリプトもコピーをしてスプレッドシートに貼り付けてください。
- [<TypeB>データ収集テンプレート](https://docs.google.com/spreadsheets/d/1U0nsRC8p9KJnjIwowYBf8E_qyk3APKlJ2zBBxujK5YE/edit?usp=sharing)

#### データ収集手順

- 1. XXXX
- 2. XXXX 


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


