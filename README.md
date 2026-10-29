## v1.1 更新内容

- 盾（耐久力 III・修繕 I）を追加。装備19個・エンチャント79項目。
- すべて／武器／防具／道具のカテゴリ切り替えを追加。
- iPhone Safariで設定ダイアログの横ずれ対策とスクロール改善。
- JSON読み込みボタンを統一。
- **重要：既存のlocalStorageキー `minecraft-adventure-tracker-v1` とJSON形式version 1を維持。既存データは引き継がれます。**
- GitHubにはZIPを展開した4ファイルをリポジトリ直下に上書きアップロードしてください。更新前にJSONバックアップを取ってください。

# Minecraft Adventure Tracker

Minecraft 統合版向けの個人用装備・探索管理サイト。静的サイトなので GitHub Pages で公開できます。

## 機能

- 装備18種類のエンチャント達成度と不足する本の一覧
- `/locate structure`、`/tp`、ゲームモード・時間・天候などのコマンド生成・コピー
- 探索記録の座標、メモ、訪問状況、お気に入り管理
- ネザー座標換算
- ダーク／ライト／端末設定に合わせるテーマ
- ブラウザ内自動保存、JSONエクスポート／インポート

## GitHub Pages に公開する方法

1. GitHubで新しいリポジトリ `minecraft-adventure-tracker` を作成（Publicを選択）。
2. ZIPを展開し、`index.html`、`style.css`、`app.js`、`README.md` の4ファイルを**リポジトリのルート**にアップロードしてコミット。
3. リポジトリの **Settings → Pages → Build and deployment** で **Deploy from a branch**、ブランチ `main`、フォルダー `/(root)` を選び、Save。
4. 公開URLは通常 `https://<GitHubユーザー名>.github.io/minecraft-adventure-tracker/` です。公開まで数分かかることがあります。
5. iPhone/iPadのSafariで開き、必要なら「ホーム画面に追加」。

GitHub Pages は一般公開されるため、**個人情報や実際のバックアップJSONをリポジトリにアップロードしないでください**。サイト本体には探索記録を含めていません。

## データの扱い

データはアクセスしたブラウザの `localStorage` に保存され、端末間で自動同期されません。設定からJSONを書き出してiCloud Driveに保存し、別の端末で読み込むと移行できます。インポート前には確認し、直前のデータをブラウザ内の別キーに退避します。ただし、同じブラウザのデータ削除では退避分も消えます。定期的にJSONファイルを保管してください。

### 注意

- コマンドは調査用クリエイティブワールド（チート有効）で利用する想定です。
- Minecraft統合版のバージョンにより `/locate structure` の識別子や一部エンチャントの対応状況が異なることがあります。実機で動作を確認してください。
- 施設の座標は自動取得できません。コマンド実行結果を見て手動登録してください。
- JSONインポートは追記ではなく、装備と探索記録の**全件置換**です。
- JSONにはデータ形式バージョン `version: 1` を付与しています。
