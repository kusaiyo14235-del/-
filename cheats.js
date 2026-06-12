const CHEATS = [
  {
    n: 'SFKhub Roblox Script Hub',
    d: 'Roblox用スクリプトを保存・編集・コピーして、実行環境に貼り付けるためのテンプレートです。',
    c: "-- ここにRoblox用のスクリプトを貼り付けてください\nprint('SFKhub Roblox Script Hub loaded')\n",
  },
  {
    n: 'Brainrot Duel PC Cheat Template',
    d: 'PC向けBrainrot Duel WebGL/Unityゲームの改造雛形です。速度変更、ダメージ無効化、オートエイムなどの実装方針を示します。',
    c: `// Brainrot Duel PC Cheat Template
// 実際のゲームオブジェクト名や変数名はゲームごとに異なるため、
// ブラウザ開発者ツールで調査しながら使ってください。

(function() {
  const log = console.log;
  log('Brainrot Duel PC Cheat Template loaded');

  function findUnity() {
    return window.unityInstance || window.unityInstance || null;
  }

  function setGameSpeed(speed) {
    const unity = findUnity();
    if (!unity) {
      log('Unity instance not found');
      return;
    }
    // ここにゲーム側の速度を変更する呼び出しを追加します。
    // 例: unity.Module.ccall('SetGameSpeed', null, ['number'], [speed]);
    log('Speed cheat enabled:', speed);
  }

  function enableGodMode() {
    // ここにHPや防御値を固定する処理を追加します。
    log('God mode template activated');
  }

  function enableAutoAim() {
    // ここにオートエイムのロジックを実装します。
    log('Auto-aim template activated');
  }

  setGameSpeed(2.5);
  enableGodMode();
  enableAutoAim();
})();`
  },
  {
    n: 'Speed Template',
    d: '速度系スクリプトの雛形です。実際のゲームや実行環境に合わせて編集してください。',
    c: "-- Speed script template\n-- 実行したい速度変更コードをここに貼り付けます。\n",
  },
  {
    n: 'ESP / Object Trace Template',
    d: 'オブジェクト検出やESP用の雛形です。Roblox実行環境で貼り付けて使います。',
    c: "-- ESP script template\n-- 対象検出コードをここにペーストしてください。\n",
  },
];
