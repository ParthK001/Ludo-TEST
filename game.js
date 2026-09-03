/**
 * Ludo Classic - Game UI & Interaction Controller
 * Upgraded with Play Store Ludo mechanics and mobile animations:
 * 1. The Hopping Bounce: 150ms step-by-step parabolic hop animation ("pawn-hop")
 * 2. Spawning / Base Release: Rubber-band elastic scale-up pop ("scale-up-bounce")
 * 3. The Capture Flight: 500ms FLIP slide, 720deg spin and 0.5 scale back to base
 * 4. Advanced 3D Dice Roll: 200ms quick shake followed by 500ms rapid 3D rotation
 * 5. Turn & Clickable Indicators: Soft pulse for active player card and "floating-pawn" animation for eligible pawns
 * 6. Home Victory Confetti: Localized confetti burst and smooth scale-down into center goal
 */

// =============================================================================
// COORDINATE & PATH CONFIGURATION
// =============================================================================

// 52-cell outer track coordinates matching 15x15 CSS Grid [row, col]
const TRACK_COORDINATES = [
  /* 0  - Red Start */    { row: 7, col: 2 },
  /* 1  */                { row: 7, col: 3 },
  /* 2  */                { row: 7, col: 4 },
  /* 3  */                { row: 7, col: 5 },
  /* 4  */                { row: 7, col: 6 },
  /* 5  */                { row: 6, col: 7 },
  /* 6  */                { row: 5, col: 7 },
  /* 7  */                { row: 4, col: 7 },
  /* 8  - Safe Star */   { row: 3, col: 7 },
  /* 9  */                { row: 2, col: 7 },
  /* 10 */                { row: 1, col: 7 },
  /* 11 */                { row: 1, col: 8 },
  /* 12 */                { row: 1, col: 9 },
  /* 13 - Green Start */  { row: 2, col: 9 },
  /* 14 */                { row: 3, col: 9 },
  /* 15 */                { row: 4, col: 9 },
  /* 16 */                { row: 5, col: 9 },
  /* 17 */                { row: 6, col: 9 },
  /* 18 */                { row: 7, col: 10 },
  /* 19 */                { row: 7, col: 11 },
  /* 20 */                { row: 7, col: 12 },
  /* 21 - Safe Star */   { row: 7, col: 13 },
  /* 22 */                { row: 7, col: 14 },
  /* 23 */                { row: 7, col: 15 },
  /* 24 */                { row: 8, col: 15 },
  /* 25 */                { row: 9, col: 15 },
  /* 26 - Yellow Start */ { row: 9, col: 14 },
  /* 27 */                { row: 9, col: 13 },
  /* 28 */                { row: 9, col: 12 },
  /* 29 */                { row: 9, col: 11 },
  /* 30 */                { row: 9, col: 10 },
  /* 31 */                { row: 10, col: 9 },
  /* 32 */                { row: 11, col: 9 },
  /* 33 */                { row: 12, col: 9 },
  /* 34 - Safe Star */   { row: 13, col: 9 },
  /* 35 */                { row: 14, col: 9 },
  /* 36 */                { row: 15, col: 9 },
  /* 37 */                { row: 15, col: 8 },
  /* 38 */                { row: 15, col: 7 },
  /* 39 - Blue Start */   { row: 14, col: 7 },
  /* 40 */                { row: 13, col: 7 },
  /* 41 */                { row: 12, col: 7 },
  /* 42 */                { row: 11, col: 7 },
  /* 43 */                { row: 10, col: 7 },
  /* 44 */                { row: 9, col: 6 },
  /* 45 */                { row: 9, col: 5 },
  /* 46 */                { row: 9, col: 4 },
  /* 47 - Safe Star */   { row: 9, col: 3 },
  /* 48 */                { row: 9, col: 2 },
  /* 49 */                { row: 9, col: 1 },
  /* 50 */                { row: 8, col: 1 },
  /* 51 */                { row: 7, col: 1 }
];

// Colored home runway columns (5 cells leading towards center goal)
const HOME_COORDINATES = {
  red: [
    { row: 8, col: 2 },
    { row: 8, col: 3 },
    { row: 8, col: 4 },
    { row: 8, col: 5 },
    { row: 8, col: 6 }
  ],
  green: [
    { row: 2, col: 8 },
    { row: 3, col: 8 },
    { row: 4, col: 8 },
    { row: 5, col: 8 },
    { row: 6, col: 8 }
  ],
  yellow: [
    { row: 8, col: 14 },
    { row: 8, col: 13 },
    { row: 8, col: 12 },
    { row: 8, col: 11 },
    { row: 8, col: 10 }
  ],
  blue: [
    { row: 14, col: 8 },
    { row: 13, col: 8 },
    { row: 12, col: 8 },
    { row: 11, col: 8 },
    { row: 10, col: 8 }
  ]
};

// Safe squares on outer track: 4 start squares + 4 star safe cells
const SAFE_TRACK_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

// Player definitions & starting configurations
const PLAYERS = [
  {
    id: 'red',
    name: 'Red Player',
    startTrackIndex: 0,
    startCoord: { row: 7, col: 2 },
    colorClass: 'from-rose-500 to-red-600',
    badgeClass: 'bg-red-100 text-red-700 border-red-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/80',
    dotClass: 'bg-red-500',
    glowColor: 'rgba(239, 68, 68, 0.35)'
  },
  {
    id: 'green',
    name: 'Green Player',
    startTrackIndex: 13,
    startCoord: { row: 2, col: 9 },
    colorClass: 'from-emerald-500 to-green-600',
    badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/80',
    dotClass: 'bg-emerald-500',
    glowColor: 'rgba(16, 185, 129, 0.35)'
  },
  {
    id: 'yellow',
    name: 'Yellow Player',
    startTrackIndex: 26,
    startCoord: { row: 9, col: 14 },
    colorClass: 'from-amber-400 to-yellow-500',
    badgeClass: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900/80',
    dotClass: 'bg-amber-500',
    glowColor: 'rgba(234, 179, 8, 0.35)'
  },
  {
    id: 'blue',
    name: 'Blue Player',
    startTrackIndex: 39,
    startCoord: { row: 14, col: 7 },
    colorClass: 'from-blue-500 to-blue-600',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900/80',
    dotClass: 'bg-blue-500',
    glowColor: 'rgba(59, 130, 246, 0.35)'
  }
];


// =============================================================================
// GAME STATE
// =============================================================================

const gameState = {
  currentTurnIndex: 0,
  diceValue: 1,
  lastDiceRoll: null,
  diceRolled: false,
  isRolling: false,
  isAutoMoving: false,
  isMovingToken: false,
  isGameOver: false,
  consecutiveSixes: 0, // Tracks consecutive 6s in current turn
  // -1: base pocket, 0: start square, 1-50: outer track, 51-55: home runway, 56: home goal
  tokens: {
    red: [-1, -1, -1, -1],
    green: [-1, -1, -1, -1],
    yellow: [-1, -1, -1, -1],
    blue: [-1, -1, -1, -1]
  },
  scores: {
    red: 0,
    green: 0,
    yellow: 0,
    blue: 0
  }
};

// DOM Elements
const diceScene  = document.getElementById('dice-scene');
const diceCube   = document.getElementById('dice-cube');
const diceShadow = document.getElementById('dice-shadow');
const btnRoll = document.getElementById('btn-roll');
const diceValueDisplay = document.getElementById('dice-value');
const diceStatus = document.getElementById('dice-status');
const gameLog = document.getElementById('game-log');
const btnClearLog = document.getElementById('btn-clear-log');
const turnBadge = document.getElementById('turn-badge');
const currentPlayerName = document.getElementById('current-player-name');
const playerAvatarBg = document.getElementById('player-avatar-bg');
const turnInstruction = document.getElementById('turn-instruction');
const currentTurnCard = document.getElementById('current-turn-card');
const btnRestart = document.getElementById('btn-restart');
const btnRules = document.getElementById('btn-rules');

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Event Listeners
  if (btnRoll) btnRoll.addEventListener('click', handleDiceRoll);
  if (diceScene) diceScene.addEventListener('click', handleDiceRoll);

  if (btnClearLog) {
    btnClearLog.addEventListener('click', () => {
      gameLog.innerHTML = '';
      addLogEntry('System', 'Game log cleared.', 'slate');
    });
  }

  if (btnRestart) {
    btnRestart.addEventListener('click', restartGame);
  }

  if (btnRules) {
    btnRules.addEventListener('click', showRules);
  }

  // Bind token and pocket click handlers
  setupTokenListeners();

  // Initial render
  renderTokens();
  renderDiceValue(1);
  updateTurnUI();
});

// =============================================================================
// TRUE 3D DICE PHYSICS
// =============================================================================

/**
 * Each face of the cube shows a value when the cube is at a specific rotation.
 * These are the base rotations (before extra spin) that bring each face forward:
 *   Face front  = value 1 → rotateX(0)   rotateY(0)
 *   Face back   = value 6 → rotateX(0)   rotateY(180)
 *   Face right  = value 2 → rotateX(0)   rotateY(-90)
 *   Face left   = value 5 → rotateX(0)   rotateY(90)
 *   Face top    = value 3 → rotateX(-90) rotateY(0)
 *   Face bottom = value 4 → rotateX(90)  rotateY(0)
 */
const FACE_ROTATIONS = {
  1: { x: 0,    y: 0   },
  2: { x: 0,    y: -90 },
  3: { x: -90,  y: 0   },
  4: { x: 90,   y: 0   },
  5: { x: 0,    y: 90  },
  6: { x: 0,    y: 180 }
};

// Tracks the cumulative rotation applied so the cube never resets
let cubeRotation = { x: 0, y: 0, z: 0 };

/**
 * Rotate cube to show a given face value.
 * Adds random extra full spins (3–5 × 360°) for physics variety each roll.
 * @param {number} value 1–6
 */
function rotateCubeTo(value) {
  const base = FACE_ROTATIONS[value];
  const extraX = (3 + Math.floor(Math.random() * 3)) * 360;
  const extraY = (3 + Math.floor(Math.random() * 3)) * 360;
  const extraZ = Math.floor(Math.random() * 2) * 360; // Occasional Z roll

  // Align to the nearest equivalent angle that reaches the target face
  cubeRotation.x = Math.round(cubeRotation.x / 360) * 360 + extraX + base.x;
  cubeRotation.y = Math.round(cubeRotation.y / 360) * 360 + extraY + base.y;
  cubeRotation.z = Math.round(cubeRotation.z / 360) * 360 + extraZ;

  if (diceCube) {
    diceCube.style.transform =
      `rotateX(${cubeRotation.x}deg) rotateY(${cubeRotation.y}deg) rotateZ(${cubeRotation.z}deg)`;
  }
}

/** Update the "Rolled: X" text display */
function renderDiceValue(val) {
  if (diceValueDisplay) {
    diceValueDisplay.textContent = val;
  }
}

/** Trigger impact squash-and-stretch on the cube */
function triggerDiceImpact() {
  if (!diceCube) return;
  diceCube.classList.remove('dice-impact');
  void diceCube.offsetWidth; // force reflow
  diceCube.classList.add('dice-impact');
  setTimeout(() => diceCube.classList.remove('dice-impact'), 200);
}

function handleDiceRoll() {
  if (gameState.isRolling || gameState.isGameOver || gameState.isAutoMoving || gameState.isMovingToken) return;

  if (gameState.diceRolled) {
    addLogEntry('System', 'Select a token to move before rolling again!', 'slate');
    return;
  }

  // Pick the final value now so the cube spins directly to it
  const finalValue = Math.floor(Math.random() * 6) + 1;

  gameState.isRolling = true;
  if (diceStatus) diceStatus.textContent = 'Rolling...';
  if (btnRoll) btnRoll.disabled = true;

  // Shadow goes wide & blurry to show the dice is airborne
  if (diceShadow) {
    diceShadow.classList.remove('landed');
    diceShadow.classList.add('rolling');
  }

  // Disable the transition briefly so we can add a jolt shake, then re-enable
  if (diceCube) {
    diceCube.style.transition = 'none';
    diceCube.style.transform += ' scale(1.08)';
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Restore elastic transition and fire the 3D physics spin
      if (diceCube) {
        diceCube.style.transition = 'transform 1.2s cubic-bezier(0.2, 1.25, 0.3, 1.05)';
      }
      rotateCubeTo(finalValue);

      // Shadow and impact trigger when the 1.2s transition settles
      setTimeout(() => {
        // Shadow snaps to tight/dark landed state
        if (diceShadow) {
          diceShadow.classList.remove('rolling');
          diceShadow.classList.add('landed');
        }

        // 3. Impact squash & stretch
        triggerDiceImpact();

        // Settle: reveal value and process game logic
        renderDiceValue(finalValue);

        gameState.diceValue = finalValue;
        gameState.lastDiceRoll = finalValue;
        gameState.diceRolled = true;
        gameState.isRolling = false;

        const currentPlayer = PLAYERS[gameState.currentTurnIndex];
        addLogEntry(currentPlayer.name, `Rolled a ${finalValue}!`, currentPlayer.id);

        // Confetti burst on 6
        if (finalValue === 6 && window.confetti) {
          window.confetti({ particleCount: 50, spread: 45, origin: { y: 0.7 } });
        }

        // Consecutive 6s cap
        if (finalValue === 6) {
          gameState.consecutiveSixes++;
        } else {
          gameState.consecutiveSixes = 0;
        }

        if (gameState.consecutiveSixes === 3) {
          gameState.consecutiveSixes = 0;
          gameState.diceRolled = false;
          clearPlayableHighlights();

          addLogEntry(currentPlayer.name, 'Three 6s! Turn forfeited!', currentPlayer.id);
          if (diceStatus) diceStatus.textContent = 'Three 6s! Turn forfeited!';
          if (turnInstruction) turnInstruction.textContent = 'Three consecutive 6s rolled! Turn forfeited.';

          setTimeout(() => {
            nextTurn();
            if (btnRoll) btnRoll.disabled = false;
          }, 1200);
          return;
        }

        // Evaluate legal moves
        const playable = getPlayableTokens(currentPlayer.id, finalValue);

        if (playable.length === 0) {
          if (diceStatus) diceStatus.textContent = `Rolled ${finalValue} - No moves`;
          if (turnInstruction) turnInstruction.textContent = `No valid moves with ${finalValue}. Passing turn...`;
          addLogEntry(currentPlayer.name, `No moves possible with ${finalValue}.`, currentPlayer.id);

          setTimeout(() => {
            gameState.diceRolled = false;
            gameState.consecutiveSixes = 0;
            nextTurn();
            if (btnRoll) btnRoll.disabled = false;
          }, 1100);
        } else if (playable.length === 1) {
          // Auto-Move Single Pawn
          const singleTokenIndex = playable[0];
          highlightPlayableTokens(currentPlayer.id, playable);

          if (diceStatus) diceStatus.textContent = `Rolled ${finalValue} - Auto-moving...`;
          if (turnInstruction) turnInstruction.textContent = `Auto-moving Token #${singleTokenIndex + 1}...`;

          gameState.isAutoMoving = true;
          setTimeout(async () => {
            gameState.isAutoMoving = false;
            if (!gameState.isGameOver && gameState.diceRolled) {
              await executeTokenMove(currentPlayer.id, singleTokenIndex, true);
            }
          }, 600);
        } else {
          // Multiple choices – prompt player
          if (diceStatus) {
            diceStatus.textContent = finalValue === 6 ? 'Rolled 6! Choose token' : `Rolled ${finalValue}! Choose token`;
          }
          if (turnInstruction) {
            turnInstruction.textContent = finalValue === 6
              ? 'Click a token in base to deploy, or move one on track.'
              : `Click a floating token to advance ${finalValue} squares.`;
          }
          highlightPlayableTokens(currentPlayer.id, playable);
        }
      }, 1200); // matches CSS transition duration
    });
  });
}

// =============================================================================
// TOKEN MOVEMENT & ANIMATION LOGIC
// =============================================================================

function getPlayableTokens(playerId, diceRoll) {
  const playable = [];
  const playerTokens = gameState.tokens[playerId];

  for (let i = 0; i < 4; i++) {
    const pos = playerTokens[i];
    if (pos === -1) {
      if (diceRoll === 6) {
        playable.push(i);
      }
    } else if (pos >= 0 && pos < 56) {
      if (pos + diceRoll <= 56) {
        playable.push(i);
      }
    }
  }
  return playable;
}

async function handleTokenClick(playerId, tokenIndex) {
  if (gameState.isGameOver || gameState.isRolling || gameState.isAutoMoving || gameState.isMovingToken) return;

  const currentPlayer = PLAYERS[gameState.currentTurnIndex];

  if (playerId !== currentPlayer.id) {
    addLogEntry('System', `It is not ${playerId.toUpperCase()}'s turn!`, 'slate');
    return;
  }

  if (!gameState.diceRolled) {
    addLogEntry('System', 'Please roll the dice first!', 'slate');
    return;
  }

  const playable = getPlayableTokens(playerId, gameState.lastDiceRoll);
  if (!playable.includes(tokenIndex)) {
    const tokenPos = gameState.tokens[playerId][tokenIndex];
    if (tokenPos === -1) {
      addLogEntry('System', 'Need a 6 to bring a token out of base!', 'slate');
    } else {
      addLogEntry('System', `Token #${tokenIndex + 1} cannot move ${gameState.lastDiceRoll} squares.`, 'slate');
    }
    return;
  }

  await executeTokenMove(playerId, tokenIndex, false);
}

/**
 * 1. The Hopping Bounce: 150ms step-by-step parabolic hop loop
 */
async function moveStepByStep(playerId, tokenIndex, startPos, targetPos) {
  gameState.isMovingToken = true;
  clearPlayableHighlights();

  for (let pos = startPos + 1; pos <= targetPos; pos++) {
    gameState.tokens[playerId][tokenIndex] = pos;
    renderTokens();

    const tokenEl = document.querySelector(`.token[data-player="${playerId}"][data-index="${tokenIndex}"]`);
    if (tokenEl) {
      tokenEl.classList.remove('pawn-hop');
      void tokenEl.offsetWidth; // force reflow
      tokenEl.classList.add('pawn-hop');
    }

    await new Promise(resolve => setTimeout(resolve, 150));
  }

  const tokenEl = document.querySelector(`.token[data-player="${playerId}"][data-index="${tokenIndex}"]`);
  if (tokenEl) {
    tokenEl.classList.remove('pawn-hop');
  }
  gameState.isMovingToken = false;
}

/**
 * Executes token movement, applying mobile animations:
 * - 2. Spawning scale-up-bounce
 * - 1. Step-by-step pawn-hop
 * - 3. Capture flight animation
 * - 6. Home entry scale-down & localized confetti
 */
async function executeTokenMove(playerId, tokenIndex, isAutoMove = false) {
  gameState.isMovingToken = true;
  clearPlayableHighlights();

  const currentPlayer = PLAYERS[gameState.currentTurnIndex];
  const tokenPos = gameState.tokens[playerId][tokenIndex];
  const diceRoll = gameState.lastDiceRoll;
  const verb = isAutoMove ? 'Auto-moved' : 'Moved';

  // 2. Base Release / Spawning: apply scale-up-bounce
  if (tokenPos === -1) {
    if (diceRoll === 6) {
      gameState.tokens[playerId][tokenIndex] = 0;
      renderTokens();

      const tokenEl = document.querySelector(`.token[data-player="${playerId}"][data-index="${tokenIndex}"]`);
      if (tokenEl) {
        tokenEl.classList.add('scale-up-bounce');
        setTimeout(() => tokenEl.classList.remove('scale-up-bounce'), 450);
      }

      addLogEntry(currentPlayer.name, `${verb} Token #${tokenIndex + 1} onto the track!`, playerId);

      gameState.isMovingToken = false;
      afterMove(true, false, false);
    }
    return;
  }

  // 1. Moving along track or home runway: 150ms step-by-step hop
  if (tokenPos >= 0 && tokenPos < 56) {
    const newPos = tokenPos + diceRoll;

    if (newPos > 56) {
      addLogEntry('System', `Cannot move Token #${tokenIndex + 1}: exact roll required to enter Home!`, 'slate');
      gameState.isMovingToken = false;
      return;
    }

    // Step-by-step hop animation
    await moveStepByStep(playerId, tokenIndex, tokenPos, newPos);

    let didCapture = false;
    let reachedHome = false;

    // 6. Home Victory Entry: localized confetti & scale down
    if (newPos === 56) {
      reachedHome = true;

      // Localized canvas-confetti burst from center home
      triggerHomeConfetti(playerId);

      // Scale token down into center safe
      const tokenEl = document.querySelector(`.token[data-player="${playerId}"][data-index="${tokenIndex}"]`);
      if (tokenEl) {
        tokenEl.classList.add('token-home-entering');
        await new Promise(r => setTimeout(r, 500));
        tokenEl.classList.remove('token-home-entering');
      }

      gameState.scores[playerId]++;
      updateScoresUI();
      renderTokens();

      addLogEntry(currentPlayer.name, `🎉 ${verb} Token #${tokenIndex + 1} into the center HOME!`, playerId);

      // Check Win Condition (all 4 tokens home)
      if (gameState.scores[playerId] === 4) {
        gameState.isMovingToken = false;
        handleWin(playerId);
        return;
      }

      // Extra roll for reaching Home
      addLogEntry(currentPlayer.name, 'Extra roll for reaching Home!', currentPlayer.id);
    } else {
      addLogEntry(currentPlayer.name, `${verb} Token #${tokenIndex + 1} by ${diceRoll} squares.`, playerId);

      // Check Captures on outer track (steps 0 to 50)
      if (newPos <= 50) {
        didCapture = await checkAndAnimateCapture(playerId, newPos);
        if (didCapture) {
          addLogEntry(currentPlayer.name, 'Extra roll for capturing!', currentPlayer.id);
        }
      }
    }

    renderTokens();
    gameState.isMovingToken = false;

    const isSix = (diceRoll === 6);
    const hasExtraRoll = isSix || didCapture || reachedHome;
    afterMove(hasExtraRoll, didCapture, reachedHome);
  }
}

/**
 * 3. The Capture Flight:
 * Smoothly slides the captured token back to its base pocket over 500ms
 * with 720deg spin and 0.5 scale.
 */
async function checkAndAnimateCapture(playerId, tokenPos) {
  const currentTrackIndex = (PLAYERS.find(p => p.id === playerId).startTrackIndex + tokenPos) % 52;

  // Safe zones are immune to captures
  if (SAFE_TRACK_INDICES.includes(currentTrackIndex)) {
    return false;
  }

  let captured = false;

  for (const otherPlayer of PLAYERS) {
    if (otherPlayer.id === playerId) continue;

    for (let i = 0; i < 4; i++) {
      const otherPos = gameState.tokens[otherPlayer.id][i];
      if (otherPos >= 0 && otherPos <= 50) {
        const otherTrackIndex = (otherPlayer.startTrackIndex + otherPos) % 52;
        if (otherTrackIndex === currentTrackIndex) {
          captured = true;
          addLogEntry(
            PLAYERS.find(p => p.id === playerId).name,
            `⚔️ Captured ${otherPlayer.name}'s Token #${i + 1}! Sent back to base!`,
            playerId
          );

          // Execute Capture Flight Animation
          await animateCaptureFlight(otherPlayer.id, i);
        }
      }
    }
  }

  return captured;
}

/**
 * Animates the physical return of a captured token to its base slot
 */
async function animateCaptureFlight(otherPlayerId, tokenIdx) {
  const otherTokenEl = document.querySelector(`.token[data-player="${otherPlayerId}"][data-index="${tokenIdx}"]`);
  const pocket = document.getElementById(`${otherPlayerId}-pocket-${tokenIdx}`);

  if (!otherTokenEl || !pocket) {
    gameState.tokens[otherPlayerId][tokenIdx] = -1;
    renderTokens();
    return;
  }

  const startRect = otherTokenEl.getBoundingClientRect();
  const endRect = pocket.getBoundingClientRect();

  const deltaX = endRect.left + (endRect.width - startRect.width) / 2 - startRect.left;
  const deltaY = endRect.top + (endRect.height - startRect.height) / 2 - startRect.top;

  otherTokenEl.classList.add('capture-flying');
  otherTokenEl.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease';
  otherTokenEl.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.5) rotate(720deg)`;
  otherTokenEl.style.zIndex = '100';

  await new Promise(r => setTimeout(r, 500));

  otherTokenEl.style.transition = '';
  otherTokenEl.style.transform = '';
  otherTokenEl.style.zIndex = '';
  otherTokenEl.classList.remove('capture-flying');

  gameState.tokens[otherPlayerId][tokenIdx] = -1;
  renderTokens();
}

/**
 * 6. Home Victory Confetti: localized burst from center home
 */
function triggerHomeConfetti(playerId) {
  if (!window.confetti) return;

  const centerHome = document.getElementById('center-home');
  let originX = 0.5;
  let originY = 0.5;

  if (centerHome) {
    const rect = centerHome.getBoundingClientRect();
    originX = (rect.left + rect.width / 2) / window.innerWidth;
    originY = (rect.top + rect.height / 2) / window.innerHeight;
  }

  const colorPalettes = {
    red: ['#ef4444', '#f87171', '#ffffff', '#fbbf24'],
    green: ['#10b981', '#34d399', '#ffffff', '#fbbf24'],
    yellow: ['#eab308', '#fde047', '#ffffff', '#f59e0b'],
    blue: ['#3b82f6', '#60a5fa', '#ffffff', '#fbbf24']
  };

  const colors = colorPalettes[playerId] || ['#ef4444', '#10b981', '#eab308', '#3b82f6'];

  window.confetti({
    particleCount: 75,
    spread: 80,
    origin: { x: originX, y: originY },
    colors: colors,
    disableForReducedMotion: true
  });
}

function afterMove(hasExtraRoll, didCapture = false, reachedHome = false) {
  gameState.diceRolled = false;
  clearPlayableHighlights();

  if (hasExtraRoll) {
    let reason = 'Rolled a 6!';
    if (didCapture && reachedHome) {
      reason = 'Capture & Home finish!';
    } else if (didCapture) {
      reason = 'Captured opponent!';
    } else if (reachedHome) {
      reason = 'Token reached Home!';
    }

    if (diceStatus) diceStatus.textContent = `Bonus roll: ${reason}`;
    if (turnInstruction) turnInstruction.textContent = `You earned an extra roll (${reason}). Click Roll Dice!`;
    if (btnRoll) btnRoll.disabled = false;
  } else {
    gameState.consecutiveSixes = 0;
    nextTurn();
  }
}

function nextTurn() {
  gameState.consecutiveSixes = 0;
  gameState.currentTurnIndex = (gameState.currentTurnIndex + 1) % PLAYERS.length;
  updateTurnUI();
}

// =============================================================================
// VISUAL RENDERER & MULTI-TOKEN MINI-GRID
// =============================================================================

function getTokenCoordinates(playerId, position) {
  if (position === -1) return null; // in base

  if (position >= 0 && position <= 50) {
    const player = PLAYERS.find(p => p.id === playerId);
    const trackIndex = (player.startTrackIndex + position) % 52;
    return TRACK_COORDINATES[trackIndex];
  }

  if (position >= 51 && position <= 55) {
    const homeIndex = position - 51;
    return HOME_COORDINATES[playerId][homeIndex];
  }

  if (position === 56) {
    return 'home'; // Center goal
  }

  return null;
}

function renderTokens() {
  for (const player of PLAYERS) {
    const playerId = player.id;

    for (let i = 0; i < 4; i++) {
      const pos = gameState.tokens[playerId][i];
      const tokenEl = document.querySelector(`.token[data-player="${playerId}"][data-index="${i}"]`);
      if (!tokenEl || tokenEl.classList.contains('capture-flying')) continue;

      if (pos === -1) {
        const pocket = document.getElementById(`${playerId}-pocket-${i}`);
        if (pocket && tokenEl.parentElement !== pocket) {
          pocket.appendChild(tokenEl);
        }
      } else if (pos >= 0 && pos <= 55) {
        const coords = getTokenCoordinates(playerId, pos);
        if (coords) {
          const cell = document.querySelector(`.cell[data-row="${coords.row}"][data-col="${coords.col}"]`);
          if (cell && tokenEl.parentElement !== cell) {
            cell.appendChild(tokenEl);
          }
        }
      } else if (pos === 56) {
        const center = document.getElementById('center-home');
        if (center && tokenEl.parentElement !== center) {
          center.appendChild(tokenEl);
        }
      }
    }
  }

  // Multi-token mini-grid arrangement inside single cells
  document.querySelectorAll('.cell').forEach(cell => {
    const tokens = Array.from(cell.querySelectorAll('.token:not(.capture-flying)'));
    const count = tokens.length;

    if (count === 0) return;

    if (count === 1) {
      const tok = tokens[0];
      tok.style.position = 'relative';
      tok.style.width = '78%';
      tok.style.height = '78%';
      tok.style.aspectRatio = '1 / 1';
      tok.style.flexShrink = '0';
      tok.style.top = '';
      tok.style.left = '';
      tok.style.right = '';
      tok.style.bottom = '';
      tok.style.transform = '';
      tok.style.zIndex = '10';
    } else if (count === 2) {
      tokens.forEach((tok, idx) => {
        tok.style.position = 'absolute';
        tok.style.width = '48%';
        tok.style.height = '48%';
        tok.style.aspectRatio = '1 / 1';
        tok.style.flexShrink = '0';
        tok.style.transform = '';
        tok.style.zIndex = String(10 + idx);

        if (idx === 0) {
          tok.style.top = '10%';
          tok.style.left = '10%';
          tok.style.right = 'auto';
          tok.style.bottom = 'auto';
        } else {
          tok.style.bottom = '10%';
          tok.style.right = '10%';
          tok.style.top = 'auto';
          tok.style.left = 'auto';
        }
      });
    } else if (count === 3) {
      tokens.forEach((tok, idx) => {
        tok.style.position = 'absolute';
        tok.style.width = '44%';
        tok.style.height = '44%';
        tok.style.aspectRatio = '1 / 1';
        tok.style.flexShrink = '0';
        tok.style.zIndex = String(10 + idx);

        if (idx === 0) {
          tok.style.top = '8%';
          tok.style.left = '8%';
          tok.style.right = 'auto';
          tok.style.bottom = 'auto';
          tok.style.transform = '';
        } else if (idx === 1) {
          tok.style.top = '8%';
          tok.style.right = '8%';
          tok.style.left = 'auto';
          tok.style.bottom = 'auto';
          tok.style.transform = '';
        } else {
          tok.style.bottom = '8%';
          tok.style.left = '50%';
          tok.style.top = 'auto';
          tok.style.right = 'auto';
          tok.style.transform = 'translateX(-50%)';
        }
      });
    } else {
      tokens.forEach((tok, idx) => {
        tok.style.position = 'absolute';
        tok.style.width = '44%';
        tok.style.height = '44%';
        tok.style.aspectRatio = '1 / 1';
        tok.style.flexShrink = '0';
        tok.style.transform = '';
        tok.style.zIndex = String(10 + idx);

        const quadrant = idx % 4;
        if (quadrant === 0) {
          tok.style.top = '8%';
          tok.style.left = '8%';
          tok.style.right = 'auto';
          tok.style.bottom = 'auto';
        } else if (quadrant === 1) {
          tok.style.top = '8%';
          tok.style.right = '8%';
          tok.style.left = 'auto';
          tok.style.bottom = 'auto';
        } else if (quadrant === 2) {
          tok.style.bottom = '8%';
          tok.style.left = '8%';
          tok.style.top = 'auto';
          tok.style.right = 'auto';
        } else {
          tok.style.bottom = '8%';
          tok.style.right = '8%';
          tok.style.top = 'auto';
          tok.style.left = 'auto';
        }
      });
    }
  });

  // Base pockets
  document.querySelectorAll('.token-pocket').forEach(pocket => {
    const tok = pocket.querySelector('.token:not(.capture-flying)');
    if (tok) {
      tok.style.position = 'relative';
      tok.style.width = '78%';
      tok.style.height = '78%';
      tok.style.aspectRatio = '1 / 1';
      tok.style.flexShrink = '0';
      tok.style.top = '';
      tok.style.left = '';
      tok.style.right = '';
      tok.style.bottom = '';
      tok.style.transform = '';
      tok.style.zIndex = '10';
    }
  });

  // Finished center home tokens
  const centerTokens = document.querySelectorAll('#center-home > .token:not(.token-home-entering)');
  centerTokens.forEach((tok, idx) => {
    tok.style.width = '30%';
    tok.style.height = '30%';
    tok.style.aspectRatio = '1 / 1';
    tok.style.flexShrink = '0';
    tok.style.position = 'absolute';
    const angle = (idx / (centerTokens.length || 1)) * 2 * Math.PI;
    tok.style.left = `calc(50% + ${Math.round(Math.cos(angle) * 26)}% - 15%)`;
    tok.style.top = `calc(50% + ${Math.round(Math.sin(angle) * 26)}% - 15%)`;
    tok.style.zIndex = '15';
  });
}

/**
 * 5. Floating animation for eligible / selectable pawns
 */
function highlightPlayableTokens(playerId, playableIndices) {
  clearPlayableHighlights();

  playableIndices.forEach(idx => {
    const token = document.querySelector(`.token[data-player="${playerId}"][data-index="${idx}"]`);
    if (token) {
      token.classList.add('pulse', 'active', 'floating-pawn');
    }
  });
}

function clearPlayableHighlights() {
  document.querySelectorAll('.token').forEach(token => {
    token.classList.remove('pulse', 'active', 'floating-pawn');
  });
}

// =============================================================================
// UI UPDATES & LOGGING
// =============================================================================

function updateTurnUI() {
  const player = PLAYERS[gameState.currentTurnIndex];

  if (currentPlayerName) currentPlayerName.textContent = player.name;
  if (turnBadge) {
    turnBadge.className = `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${player.badgeClass} border transition-colors`;
    turnBadge.innerHTML = `<span class="w-2 h-2 rounded-full ${player.dotClass} animate-ping"></span> ${player.name}'s Turn`;
  }
  if (playerAvatarBg) {
    playerAvatarBg.className = `w-12 h-12 rounded-xl bg-gradient-to-tr ${player.colorClass} flex items-center justify-center text-white shadow-md`;
  }
  if (turnInstruction) {
    turnInstruction.textContent = `Roll the dice to move ${player.name}'s token.`;
  }
  if (diceStatus) {
    diceStatus.textContent = 'Ready to roll';
  }

  // 5. Active Turn Card continuous soft pulse
  if (currentTurnCard) {
    currentTurnCard.classList.add('active-turn-card');
    currentTurnCard.style.setProperty('--active-turn-glow', player.glowColor);
  }

  if (btnRoll) {
    btnRoll.className = `mt-3 w-full py-3 px-4 rounded-xl bg-gradient-to-r ${player.colorClass} text-white font-semibold text-sm shadow-md active:scale-[0.98] transition flex items-center justify-center space-x-2`;
    btnRoll.disabled = false;
  }

  clearPlayableHighlights();
}

function updateScoresUI() {
  for (const player of PLAYERS) {
    const el = document.getElementById(`score-${player.id}`);
    if (el) {
      el.textContent = `${gameState.scores[player.id]}/4 Home`;
    }
  }
}

function addLogEntry(sender, message, color = 'slate') {
  if (!gameLog) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const colorMap = {
    red: 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 dark:border dark:border-rose-900/60',
    green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border dark:border-emerald-900/60',
    yellow: 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 dark:border dark:border-amber-900/60',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 dark:border dark:border-blue-900/60',
    slate: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:border dark:border-slate-700/60',
    winner: 'bg-amber-400 text-slate-900 font-extrabold'
  };

  const tagClass = colorMap[color] || colorMap.slate;

  const entry = document.createElement('div');
  entry.className = 'flex items-start space-x-2 text-slate-600 dark:text-slate-400 transition-colors';
  entry.innerHTML = `
    <span class="text-[10px] text-slate-400 dark:text-slate-500 font-mono pt-0.5">${timeStr}</span>
    <div class="flex-1">
      <span class="inline-block px-1.5 py-0.2 text-[10px] font-bold rounded ${tagClass} mr-1">${sender.toUpperCase()}</span>
      <span>${message}</span>
    </div>
  `;

  gameLog.appendChild(entry);
  gameLog.scrollTop = gameLog.scrollHeight;
}

function setupTokenListeners() {
  const tokens = document.querySelectorAll('.token');
  tokens.forEach(token => {
    token.addEventListener('click', async (e) => {
      e.stopPropagation();
      const playerId = token.dataset.player;
      const index = parseInt(token.dataset.index, 10);
      await handleTokenClick(playerId, index);
    });
  });

  document.querySelectorAll('.token-pocket').forEach(pocket => {
    pocket.addEventListener('click', async () => {
      const token = pocket.querySelector('.token');
      if (token) {
        const playerId = token.dataset.player;
        const index = parseInt(token.dataset.index, 10);
        await handleTokenClick(playerId, index);
      }
    });
  });
}

function handleWin(playerId) {
  gameState.isGameOver = true;
  const player = PLAYERS.find(p => p.id === playerId);

  addLogEntry('Winner', `🏆 ${player.name} has won the game! Congratulations!`, 'winner');
  if (diceStatus) diceStatus.textContent = `${player.name} Wins!`;
  if (turnInstruction) turnInstruction.textContent = 'Game over! Click Restart to play again.';
  if (btnRoll) btnRoll.disabled = true;

  if (window.confetti) {
    const duration = 3500;
    const end = Date.now() + duration;
    (function frame() {
      window.confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
      window.confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }
}

function restartGame() {
  gameState.currentTurnIndex = 0;
  gameState.diceValue = 1;
  gameState.lastDiceRoll = null;
  gameState.diceRolled = false;
  gameState.isRolling = false;
  gameState.isAutoMoving = false;
  gameState.isMovingToken = false;
  gameState.isGameOver = false;
  gameState.consecutiveSixes = 0;

  gameState.tokens = {
    red: [-1, -1, -1, -1],
    green: [-1, -1, -1, -1],
    yellow: [-1, -1, -1, -1],
    blue: [-1, -1, -1, -1]
  };

  gameState.scores = {
    red: 0,
    green: 0,
    yellow: 0,
    blue: 0
  };

  renderTokens();
  updateScoresUI();
  updateTurnUI();

  // Reset the 3D cube back to face-1 (front) without animation
  cubeRotation = { x: 0, y: 0, z: 0 };
  if (diceCube) {
    diceCube.style.transition = 'none';
    diceCube.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
  }
  if (diceShadow) {
    diceShadow.classList.remove('rolling', 'landed');
  }
  renderDiceValue(1);

  if (btnRoll) btnRoll.disabled = false;
  if (diceStatus) diceStatus.textContent = 'Ready to roll';
  addLogEntry('System', 'Game restarted! Red Player starts.', 'slate');
}

function showRules() {
  alert(
    "Ludo Classic Rules (Play Store Standard):\n\n" +
    "1. Roll a 6 to bring a pawn out of your base yard onto your start square.\n" +
    "2. Auto-Move: When only one pawn can legally move, it automatically advances after 600ms.\n" +
    "3. Consecutive 6s: Rolling three 6s in a row forfeits your turn immediately!\n" +
    "4. Extra Rolls: You earn a bonus roll whenever you roll a 6, capture an opponent's pawn, or reach the center Home!\n" +
    "5. Safe Zones (Start squares & Star squares ★): Pawns cannot be captured here.\n" +
    "6. Captures: Landing on an opponent pawn outside safe zones captures it, flies it back to base, and awards a bonus roll!\n" +
    "7. First player to navigate all 4 pawns into the center Home wins!"
  );
}
