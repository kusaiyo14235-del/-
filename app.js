const configInputs = {
  dataUrl: document.getElementById('dataUrl'),
  frameworkUrl: document.getElementById('frameworkUrl'),
  codeUrl: document.getElementById('codeUrl'),
  companyName: document.getElementById('companyName'),
  productName: document.getElementById('productName'),
  productVersion: document.getElementById('productVersion'),
  orientationMode: document.getElementById('orientationMode'),
};

const loadButton = document.getElementById('loadButton');
const resetButton = document.getElementById('resetButton');
const canvas = document.getElementById('unity-canvas');
const gameContainer = document.getElementById('gameContainer');
const loadingOverlay = document.getElementById('loadingOverlay');
const progressBar = document.getElementById('progress-bar');
const loadingLabel = document.getElementById('loadingLabel');
const orientationWarning = document.getElementById('orientation-warning');
const orientationText = orientationWarning.querySelector('.orientation-text');
const gameSearch = document.getElementById('gameSearch');
const gameCount = document.getElementById('game-count');
const selectedGameInfo = document.getElementById('selected-game-info');
const gameList = document.getElementById('game-list');
const launchSelectedButton = document.getElementById('launchSelectedButton');
const randomGameButton = document.getElementById('randomGameButton');
const gameFrame = document.getElementById('game-frame');
const viewerMode = document.getElementById('viewer-mode');
const switchToUnityButton = document.getElementById('switchToUnityButton');
const openGameTabButton = document.getElementById('openGameTabButton');
const cheatSelect = document.getElementById('cheatSelect');
const cheatCode = document.getElementById('cheatCode');
const loadCheatButton = document.getElementById('loadCheatButton');
const copyCheatButton = document.getElementById('copyCheatButton');
const cheatDescription = document.getElementById('cheat-description');

const defaultConfig = {
  dataUrl: 'https://cdn.jsdelivr.net/gh/kelsimsk/zarara@main/Build/StealBrainrotV19.data.unityweb',
  frameworkUrl: 'https://cdn.jsdelivr.net/gh/kelsimsk/zarara@main/Build/StealBrainrotV19.framework.js.unityweb',
  codeUrl: 'https://cdn.jsdelivr.net/gh/kelsimsk/zarara@main/Build/StealBrainrotV19.wasm.unityweb',
  companyName: 'SFKhub',
  productName: 'SFKhub Launcher',
  productVersion: '1.0.0',
  orientationMode: 'none',
};

let unityInstance = null;
let currentOrientationMode = 'none';
let selectedGameIndex = -1;
let filteredGames = [...GAMES];
let currentViewer = 'unity';
const storageKey = 'steal-brainrot-launcher-state';

function setViewerMode(viewer) {
  currentViewer = viewer;
  viewerMode.textContent = `Viewer: ${viewer === 'unity' ? 'Unity' : 'HTML Game'}`;
  switchToUnityButton.disabled = viewer === 'unity';
  openGameTabButton.disabled = viewer === 'unity' || selectedGameIndex < 0;

  if (viewer === 'unity') {
    canvas.style.display = 'block';
    gameFrame.style.display = 'none';
    updateOrientationMessage();
  } else {
    canvas.style.display = 'none';
    orientationWarning.classList.remove('show');
    gameFrame.style.display = 'block';
  }
}

function saveLauncherState() {
  const state = {
    config: {
      dataUrl: configInputs.dataUrl.value,
      frameworkUrl: configInputs.frameworkUrl.value,
      codeUrl: configInputs.codeUrl.value,
      companyName: configInputs.companyName.value,
      productName: configInputs.productName.value,
      productVersion: configInputs.productVersion.value,
      orientationMode: configInputs.orientationMode.value,
    },
    search: gameSearch.value,
    selectedIndex: selectedGameIndex,
  };
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function loadLauncherState() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return false;
    const state = JSON.parse(raw);
    if (state.config) {
      Object.keys(state.config).forEach((key) => {
        if (configInputs[key]) {
          if (configInputs[key].type === 'checkbox') {
            configInputs[key].checked = state.config[key];
          } else {
                  }
        }
      });
      currentOrientationMode = state.config.orientationMode || defaultConfig.orientationMode;
    }
    if (state.search != null) {
      gameSearch.value = state.search;
    }
    if (typeof state.selectedIndex === 'number') {
      selectedGameIndex = state.selectedIndex;
    }
    return true;
  } catch (error) {
    console.warn('Cannot restore saved launcher state.', error);
    return false;
  }
}

function updateGameCount() {
  gameCount.textContent = `${filteredGames.length} games`; 
}

function selectGame(index) {
  selectedGameIndex = index;
  const items = gameList.querySelectorAll('.game-item');
  items.forEach((item, itemIndex) => {
    item.classList.toggle('selected', itemIndex === index);
    item.setAttribute('aria-selected', itemIndex === index ? 'true' : 'false');
  });

  const game = filteredGames[index];
  selectedGameInfo.textContent = game ? `選択中のゲーム: ${game.n}` : '選択中のゲーム: なし';
  saveLauncherState();
}

function renderGameList() {
  gameList.innerHTML = '';
  filteredGames.forEach((game, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'game-item';
    button.textContent = game.n;
    button.setAttribute('role', 'option');
    button.setAttribute('aria-selected', 'false');
    button.addEventListener('click', () => {
      selectGame(index);
      launchSelectedGame();
    });
    gameList.appendChild(button);
  });
  updateGameCount();
  if (filteredGames.length === 0) {
    selectedGameIndex = -1;
    selectedGameInfo.textContent = '選択中のゲーム: なし';
    return;
  }
  if (selectedGameIndex < 0 || selectedGameIndex >= filteredGames.length) {
    selectGame(0);
  } else {
    selectGame(selectedGameIndex);
  }
}

function filterGames() {
  const query = gameSearch.value.trim().toLowerCase();
  filteredGames = GAMES.filter((game) => game.n.toLowerCase().includes(query));
  renderGameList();
  saveLauncherState();
}

function launchSelectedGame() {
  if (selectedGameIndex < 0 || selectedGameIndex >= filteredGames.length) {
    return;
  }

  const game = filteredGames[selectedGameIndex];
  if (!game || !game.h) {
    return;
  }

  gameFrame.src = game.h;
  setViewerMode('html');
  saveLauncherState();
}

function launchRandomGame() {
  if (filteredGames.length === 0) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredGames.length);
  selectGame(randomIndex);
  launchSelectedGame();
}

function populateCheatList() {
  cheatSelect.innerHTML = '';
  CHEATS.forEach((cheat, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = cheat.n;
    cheatSelect.appendChild(option);
  });
}

function updateCheatPreview(index) {
  const cheat = CHEATS[index];
  if (!cheat) return;
  cheatCode.value = cheat.c;
  cheatDescription.textContent = cheat.d;
}

function loadSelectedCheat() {
  const selectedIndex = cheatSelect.selectedIndex;
  if (selectedIndex < 0) return;
  updateCheatPreview(selectedIndex);
}

function copyCheatToClipboard() {
  const text = cheatCode.value.trim();
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    cheatDescription.textContent = 'スクリプトをコピーしました。Roblox実行環境に貼り付けてください。';
  }).catch(() => {
    cheatDescription.textContent = 'コピーに失敗しました。手動で選択してコピーしてください。';
  });
}

function openGameInNewTab() {
  if (selectedGameIndex < 0 || selectedGameIndex >= filteredGames.length) {
    return;
  }
  const game = filteredGames[selectedGameIndex];
  if (game && game.h) {
    window.open(game.h, '_blank');
  }
}

function switchBackToUnity() {
  setViewerMode('unity');
}

function updateOrientationMessage() {
  const orientation = currentOrientationMode;
  const isPortrait = window.innerHeight > window.innerWidth;

  if (orientation === 'none') {
    orientationWarning.classList.remove('show');
    canvas.style.display = 'block';
    return;
  }

  const needsPortrait = orientation === 'portrait';
  if ((needsPortrait && !isPortrait) || (!needsPortrait && isPortrait)) {
    orientationWarning.classList.add('show');
    canvas.style.display = 'none';
    orientationText.textContent = needsPortrait
      ? 'Please rotate your device to portrait mode.'
      : 'Please rotate your device to landscape mode.';
  } else {
    orientationWarning.classList.remove('show');
    canvas.style.display = 'block';
  }
}

function progressHandler(progress) {
  const percent = Math.round(progress * 100);
  progressBar.style.width = percent + '%';
  loadingLabel.textContent = `Loading... ${percent}%`;
  if (progress >= 1) {
    setTimeout(() => {
      loadingOverlay.style.opacity = '0';
      loadingLabel.style.opacity = '0';
    }, 500);
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
    }, 1000);
  }
}


function resetConfig() {
  Object.keys(defaultConfig).forEach((key) => {
    if (configInputs[key]) {
      configInputs[key].value = defaultConfig[key];
    }
  });
  currentOrientationMode = defaultConfig.orientationMode;
  updateOrientationMessage();
  saveLauncherState();
}

function resizeCanvas() {
  const w = gameContainer.clientWidth;
  const h = gameContainer.clientHeight;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
}

window.addEventListener('resize', () => {
  resizeCanvas();
  updateOrientationMessage();
});

window.addEventListener('orientationchange', () => {
  setTimeout(updateOrientationMessage, 100);
});

function loadGame() {
  if (unityInstance) {
    unityInstance.Quit().catch(() => {});
    unityInstance = null;
  }

  currentOrientationMode = configInputs.orientationMode.value;
  updateOrientationMessage();

  loadingOverlay.style.display = 'block';
  loadingOverlay.style.opacity = '1';
  progressBar.style.width = '0%';
  loadingLabel.style.opacity = '1';
  loadingLabel.textContent = 'Loading... 0%';

  const config = {
    dataUrl: configInputs.dataUrl.value,
    frameworkUrl: configInputs.frameworkUrl.value,
    codeUrl: configInputs.codeUrl.value,
    streamingAssetsUrl: 'StreamingAssets',
    companyName: configInputs.companyName.value,
    productName: configInputs.productName.value,
    productVersion: configInputs.productVersion.value,
  };

  if (typeof createUnityInstance !== 'function') {
    loadingLabel.textContent = 'Loader script not loaded yet.';
    return;
  }

  createUnityInstance(canvas, config, progressHandler)
    .then((instance) => {
      unityInstance = instance;
      resizeCanvas();
      setViewerMode('unity');
    })
    .catch((error) => {
      console.error(error);
      loadingLabel.textContent = 'Failed to load Unity instance.';
      loadingOverlay.style.display = 'none';
    });
}

loadButton.addEventListener('click', loadGame);
resetButton.addEventListener('click', resetConfig);
gameSearch.addEventListener('input', filterGames);
launchSelectedButton.addEventListener('click', launchSelectedGame);
randomGameButton.addEventListener('click', launchRandomGame);
loadCheatButton.addEventListener('click', loadSelectedCheat);
copyCheatButton.addEventListener('click', copyCheatToClipboard);
switchToUnityButton.addEventListener('click', switchBackToUnity);
openGameTabButton.addEventListener('click', openGameInNewTab);

document.addEventListener('DOMContentLoaded', () => {
  const restored = loadLauncherState();
  if (!restored) {
    resetConfig();
  }
  populateCheatList();
  updateCheatPreview(0);
  resizeCanvas();
  filterGames();
  setViewerMode('unity');
});
