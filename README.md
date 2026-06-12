# SFKhub Launcher

このリポジトリには、Unity WebGLビルドとHTMLゲームを同時に扱えるシンプルなゲームランチャーが含まれています。

## 使い方

1. `index.html` をブラウザで開きます。
2. 左側の設定パネルから `dataUrl`, `frameworkUrl`, `codeUrl` などを変更します。
3. `ゲームを読み込む` ボタンを押すと、右側のプレビュー領域にUnityビルドがロードされます。

## ファイル

- `index.html`: GUIとUnity埋め込みプレイヤー
- `styles.css`: レイアウトとスタイル
- `games.js`: ゲーム一覧と選択可能なライブラリ
- `cheats.js`: Roblox用チートスクリプトライブラリ
- `app.js`: 設定の読み取り、Unityの初期化、ゲームランチャー、RobloxチートUI

## 追加機能

- 左側のライブラリでゲームを検索して、HTMLゲームを `iframe` でプレビューできます。
- `ランダム Duel` ボタンでライブラリからランダムなHTMLゲームを即起動できます。
- Roblox用のチートスクリプトを選択・編集・コピーできるパネルを追加しました。
- PC向けBrainrot Duel WebGL/Unityチートのテンプレートを追加しました。
- Unity WebGL と HTMLゲームの両方を同じUIで切り替えて使えます。

## 注意

- WebGLビルドはリモートの `jsdelivr` から読み込まれます。
- HTMLゲームは `iframe` で読み込むため、同一生成元ポリシーやサーバー設定によって制限される場合があります。
- `games.js` に読み込みたいゲームのURLを追加して拡張できます。
- PC向けBrainrot Duelチートテンプレートは雛形です。実際のゲーム内部変数や関数名を調査してから使ってください。
