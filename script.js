const HER_NAME = "Joelie Rae";

const screens = {
  intro: document.getElementById("screen-intro"),
  game: document.getElementById("screen-game"),
  question: document.getElementById("screen-question"),
  success: document.getElementById("screen-success"),
};

const continueBtn = document.getElementById("continue-btn");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const noPlaceholder = document.getElementById("no-placeholder");
const brokenCaption = document.getElementById("broken-caption");
const buttonRow = document.getElementById("button-row");
const card = document.querySelector(".card");
const herName = document.getElementById("her-name");
const surpriseBtn = document.getElementById("surprise-btn");
const surpriseArea = document.getElementById("surprise-area");
const bookEl = document.getElementById("book");
const letterFullscreenBtn = document.getElementById("letter-fullscreen-btn");
const letterFullscreen = document.getElementById("letter-fullscreen");
const letterFullscreenClose = document.getElementById("letter-fullscreen-close");
const letterFullscreenContent = document.getElementById("letter-fullscreen-content");
const letterFullscreenHearts = document.getElementById("letter-fullscreen-hearts");
const surprisePoem = document.getElementById("surprise-poem");
const confettiCanvas = document.getElementById("confetti-canvas");
const bgMusic = document.getElementById("bg-music");
const openOverlay = document.getElementById("open-overlay");
const gameZone = document.getElementById("game-zone");
const gameDone = document.getElementById("game-done");
const gameContinueBtn = document.getElementById("game-continue-btn");
const gameTitle = document.getElementById("game-title");
const gameIntro = document.getElementById("game-intro");
const gameSpellHint = document.getElementById("game-spell-hint");
const gameWordDisplay = document.getElementById("game-word-display");
const gameDoneMessage = document.getElementById("game-done-message");

const SPELL_WORD = "JOELIE RAE";
const GAME_TITLE = "Pop quiz time 💕";
const GAME_INTRO = "The most beautiful girl there is.";
const GAME_HINT = "Tap the letters in the right order.";
const GAME_COMPLETE_MSG = "That's you. My beautiful girlfriend 💖";

let spellNextIndex = 0;

const captionTexts = ["The Grinch keeps stealing the NO button"];

let dodgeCount = 0;
let noIsAbsolute = false;
let confettiRunning = false;
let ignoreFirstHover = true;
let lastMousePos = null;
let hoverRafId = null;

const prefersHover = window.matchMedia("(hover: hover) and (pointer: fine)")
  .matches;

const showScreen = (screen) => {
  Object.values(screens).forEach((item) =>
    item.classList.remove("screen--active")
  );
  screen.classList.add("screen--active");
};

const startGame = () => {
  if (!gameZone) return;
  const word = SPELL_WORD;
  spellNextIndex = 0;
  if (gameDone) gameDone.classList.remove("game-done--show");
  gameZone.innerHTML = "";
  if (gameTitle) gameTitle.textContent = GAME_TITLE;
  if (gameIntro) gameIntro.textContent = GAME_INTRO;
  if (gameSpellHint) gameSpellHint.textContent = GAME_HINT;
  const buildDisplay = (nextIdx) => {
    return word
      .split("")
      .map((c, i) => {
        if (i < nextIdx) return c === " " ? "  " : c;
        return c === " " ? "  " : "_";
      })
      .join(" ");
  };

  if (gameWordDisplay) {
    gameWordDisplay.textContent = buildDisplay(0);
  }
  const zoneW = gameZone.offsetWidth || 280;
  const zoneH = gameZone.offsetHeight || 180;
  const letterSize = 44;
  const gap = 10;
  const reserveBottom = 90;
  const maxX = Math.max(0, zoneW - letterSize);
  const maxY = Math.max(0, zoneH - letterSize - reserveBottom);

  const overlaps = (x, y, placed) => {
    for (let i = 0; i < placed.length; i += 1) {
      const p = placed[i];
      if (
        x + letterSize + gap > p.x &&
        x < p.x + letterSize + gap &&
        y + letterSize + gap > p.y &&
        y < p.y + letterSize + gap
      ) {
        return true;
      }
    }
    return false;
  };

  const positions = [];
  const maxTries = 80;
  for (let i = 0; i < word.length; i += 1) {
    if (word[i] === " ") continue;
    let x = 0;
    let y = 0;
    let tries = 0;
    do {
      x = Math.random() * maxX;
      y = Math.random() * maxY;
      tries += 1;
    } while (overlaps(x, y, positions) && tries < maxTries);
    positions.push({
      x,
      y,
      char: word[i],
      index: i,
    });
  }

  positions.forEach(({ x, y, char, index }) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "game-letter";
    btn.textContent = char;
    btn.dataset.index = String(index);
    btn.setAttribute("aria-label", `Letter ${char}`);
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;

    btn.addEventListener("click", () => {
      if (word[spellNextIndex] !== char) {
        btn.classList.add("game-letter--wrong");
        setTimeout(() => btn.classList.remove("game-letter--wrong"), 400);
        return;
      }
      btn.classList.add("game-letter--collected");
      spellNextIndex += 1;
      while (spellNextIndex < word.length && word[spellNextIndex] === " ") {
        spellNextIndex += 1;
      }
      if (gameWordDisplay) {
        gameWordDisplay.textContent = buildDisplay(spellNextIndex);
      }
      if (spellNextIndex >= word.length && gameDone) {
        if (gameDoneMessage) gameDoneMessage.textContent = GAME_COMPLETE_MSG;
        gameDone.classList.add("game-done--show");
      }
    });

    gameZone.appendChild(btn);
  });
};

const updateCaption = () => {
  if (dodgeCount < 2) return;
  const index = (dodgeCount - 1) % captionTexts.length;
  brokenCaption.textContent = captionTexts[index];
  brokenCaption.classList.add("caption--show");
};

const setNoButtonAbsolute = () => {
  if (noIsAbsolute) return;
  const cardRect = card.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();
  const left = noRect.left - cardRect.left;
  const top = noRect.top - cardRect.top;
  noPlaceholder.style.width = `${noRect.width}px`;
  noPlaceholder.style.height = `${noRect.height}px`;
  noPlaceholder.classList.add("show");
  noBtn.style.position = "absolute";
  noBtn.style.zIndex = "2";
  noBtn.style.left = `${left}px`;
  noBtn.style.top = `${top}px`;
  noIsAbsolute = true;
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const overlaps = (rectA, rectB, padding = 8) => {
  return !(
    rectA.right + padding < rectB.left ||
    rectA.left - padding > rectB.right ||
    rectA.bottom + padding < rectB.top ||
    rectA.top - padding > rectB.bottom
  );
};

const getCardInnerBounds = () => {
  const cardRect = card.getBoundingClientRect();
  const styles = window.getComputedStyle(card);
  const padLeft = parseFloat(styles.paddingLeft) || 0;
  const padRight = parseFloat(styles.paddingRight) || 0;
  const padTop = parseFloat(styles.paddingTop) || 0;
  const padBottom = parseFloat(styles.paddingBottom) || 0;

  return {
    left: padLeft,
    top: padTop,
    right: cardRect.width - padRight,
    bottom: cardRect.height - padBottom,
  };
};

const dodgeNoButton = (cursorPos = null) => {
  setNoButtonAbsolute();

  const cardRect = card.getBoundingClientRect();
  const bounds = getCardInnerBounds();
  const noRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const buttonRowRect = buttonRow.getBoundingClientRect();
  const captionRect = brokenCaption.getBoundingClientRect();

  const noWidth = noRect.width;
  const noHeight = noRect.height;

  const minX = bounds.left;
  const maxX = bounds.right - noWidth;
  const safeMaxX = Math.max(minX, maxX);
  const minY = clamp(
    buttonRowRect.top - cardRect.top,
    bounds.top,
    bounds.bottom
  );
  const captionSpace = captionRect.height ? captionRect.height + 12 : 0;
  const maxY = bounds.bottom - noHeight - captionSpace;
  const safeMaxY = Math.max(minY, maxY);

  const minDistanceFromCursor = 250;
  let nextLeft = minX;
  let nextTop = minY;
  let found = false;

  for (let i = 0; i < 40; i += 1) {
    const randLeft = Math.random() * (safeMaxX - minX) + minX;
    const randTop = Math.random() * (safeMaxY - minY) + minY;

    const nextRect = {
      left: cardRect.left + randLeft,
      top: cardRect.top + randTop,
      right: cardRect.left + randLeft + noWidth,
      bottom: cardRect.top + randTop + noHeight,
    };

    const cursorDistanceOk = (() => {
      if (!cursorPos) return true;
      const centerX = nextRect.left + noWidth / 2;
      const centerY = nextRect.top + noHeight / 2;
      return Math.hypot(cursorPos.x - centerX, cursorPos.y - centerY) > minDistanceFromCursor;
    })();

    if (!overlaps(nextRect, yesRect, 12) && cursorDistanceOk) {
      nextLeft = randLeft;
      nextTop = randTop;
      found = true;
      break;
    }
  }

  if (!found && cursorPos) {
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;
    const cursorInLeft = cursorPos.x < cardCenterX;
    const cursorInTop = cursorPos.y < cardCenterY;
    nextLeft = cursorInLeft ? safeMaxX - (safeMaxX - minX) * 0.3 : minX + (safeMaxX - minX) * 0.3;
    nextTop = cursorInTop ? safeMaxY - (safeMaxY - minY) * 0.3 : minY + (safeMaxY - minY) * 0.3;
    if (overlaps(
      { left: cardRect.left + nextLeft, top: cardRect.top + nextTop, right: cardRect.left + nextLeft + noWidth, bottom: cardRect.top + nextTop + noHeight },
      yesRect,
      12
    )) {
      nextLeft = cursorInLeft ? minX : safeMaxX - noWidth * 0.5;
      nextTop = clamp(nextTop, minY, safeMaxY);
    }
  }

  noBtn.style.left = `${clamp(nextLeft, minX, safeMaxX)}px`;
  noBtn.style.top = `${clamp(nextTop, minY, safeMaxY)}px`;

  dodgeCount += 1;
  updateCaption();
};

const handleHoverCheck = () => {
  hoverRafId = null;
  if (!prefersHover) return;
  if (!screens.question.classList.contains("screen--active")) return;
  if (!lastMousePos) return;
  if (ignoreFirstHover) {
    ignoreFirstHover = false;
    return;
  }

  const noRect = noBtn.getBoundingClientRect();
  const centerX = noRect.left + noRect.width / 2;
  const centerY = noRect.top + noRect.height / 2;
  const distance = Math.hypot(
    lastMousePos.x - centerX,
    lastMousePos.y - centerY
  );

  if (distance < 100) {
    dodgeNoButton(lastMousePos);
  }
};

const onMouseMove = (event) => {
  if (!prefersHover) return;
  lastMousePos = { x: event.clientX, y: event.clientY };
  if (hoverRafId) return;
  hoverRafId = requestAnimationFrame(handleHoverCheck);
};

const launchHearts = (container = null) => {
  const heartsContainer = container || document.querySelector(".bg-hearts");
  if (!heartsContainer) return;
  const isSmallScreen = window.matchMedia("(max-width: 600px)").matches;
  const heartCount = isSmallScreen ? 22 : 32;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < heartCount; i += 1) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = "♥";
    const duration = 8 + Math.random() * 10;
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.animationDelay = `${-Math.random() * duration}s`;
    heart.style.opacity = `${0.35 + Math.random() * 0.5}`;
    fragment.appendChild(heart);
  }
  heartsContainer.appendChild(fragment);
};

const resizeConfettiCanvas = () => {
  const rect = card.getBoundingClientRect();
  confettiCanvas.width = rect.width;
  confettiCanvas.height = rect.height;
};

const warmUpConfettiCanvas = () => {
  resizeConfettiCanvas();
  const ctx = confettiCanvas.getContext("2d");
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  ctx.fillStyle = "#ff8cc6";
  ctx.fillRect(0, 0, 4, 4);
};

const startConfetti = () => {
  if (confettiRunning) return;
  confettiRunning = true;

  resizeConfettiCanvas();
  confettiCanvas.classList.add("active");

  const ctx = confettiCanvas.getContext("2d");
  const w = confettiCanvas.width;
  const h = confettiCanvas.height;
  const particles = [];
  const colors = ["#ff8cc6", "#ffb3d9", "#b58bff", "#ffd966", "#6ee7b7"];
  const particleCount = 100;

  const baseDt = 1 / 60;

  for (let i = 0; i < particleCount; i += 1) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * (h + 120) - 60,
      size: 5 + Math.random() * 5,
      color: colors[i % colors.length],
      speedY: 5 + Math.random() * 5,
      speedX: -2 + Math.random() * 4,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.15,
    });
  }

  let lastTime = performance.now();

  const animate = (now) => {
    if (!confettiRunning) return;
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    ctx.clearRect(0, 0, w, h);

    const scale = dt / baseDt;

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      p.x += p.speedX * scale;
      p.y += p.speedY * scale;
      p.rotation += p.spin * scale;

      if (p.y > h + 30) {
        p.y = -20;
        p.x = Math.random() * w;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }

    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
};

const stopConfetti = () => {
  confettiRunning = false;
  confettiCanvas.classList.remove("active");
};

const startBgMusic = () => {
  if (bgMusic) bgMusic.play().catch(() => {});
};

if (openOverlay) {
  openOverlay.classList.add("open-overlay--hidden");
}
showScreen(screens.question);
warmUpConfettiCanvas();



continueBtn.addEventListener("click", () => {
  startBgMusic();
  showScreen(screens.question);
  ignoreFirstHover = true;
  warmUpConfettiCanvas();
});

if (gameContinueBtn) {
  gameContinueBtn.addEventListener("click", () => {
    showScreen(screens.intro);
  });
}

yesBtn.addEventListener("click", () => {
  startBgMusic();
  showScreen(screens.success);
  brokenCaption.classList.remove("caption--show");
  startConfetti();
});

noBtn.addEventListener("click", (event) => {
  if (prefersHover) return;
  event.preventDefault();
  dodgeNoButton(lastMousePos);
});

noBtn.addEventListener("touchstart", (event) => {
  if (prefersHover) return;
  event.preventDefault();
  dodgeNoButton(lastMousePos);
});

window.addEventListener("mousemove", onMouseMove);
noBtn.addEventListener("mousemove", () => {
  if (!prefersHover) return;
  if (!screens.question.classList.contains("screen--active")) return;
  dodgeNoButton(lastMousePos);
});
window.addEventListener("resize", () => {
  if (screens.success.classList.contains("screen--active")) {
    resizeConfettiCanvas();
  }
});

surpriseBtn.addEventListener("click", () => {
  const isShowing = surpriseArea.classList.toggle("surprise--show");
  if (bookEl) {
    if (isShowing) {
      bookEl.classList.remove("book--open");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => bookEl.classList.add("book--open"));
      });
    } else {
      bookEl.classList.remove("book--open");
    }
  }
});

function openLetterFullscreen() {
  if (surprisePoem && letterFullscreenContent && letterFullscreen) {
    letterFullscreenContent.innerHTML = surprisePoem.innerHTML;
    if (letterFullscreenHearts && letterFullscreenHearts.children.length === 0) {
      launchHearts(letterFullscreenHearts);
    }
    letterFullscreen.classList.add("letter-fullscreen--show");
    letterFullscreen.setAttribute("aria-hidden", "false");
  }
}

function closeLetterFullscreen() {
  if (letterFullscreen) {
    letterFullscreen.classList.remove("letter-fullscreen--show");
    letterFullscreen.setAttribute("aria-hidden", "true");
  }
}

if (letterFullscreenBtn) {
  letterFullscreenBtn.addEventListener("click", openLetterFullscreen);
}
if (letterFullscreenClose) {
  letterFullscreenClose.addEventListener("click", closeLetterFullscreen);
}
if (letterFullscreen) {
  letterFullscreen.addEventListener("click", (e) => {
    if (e.target === letterFullscreen) closeLetterFullscreen();
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && letterFullscreen && letterFullscreen.classList.contains("letter-fullscreen--show")) {
    closeLetterFullscreen();
  }
});

if (herName) {
  herName.textContent = HER_NAME || "there";
}

const letterDateEl = document.getElementById("letter-date");
if (letterDateEl) {
  letterDateEl.textContent = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

launchHearts();
warmUpConfettiCanvas();

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopConfetti();
  } else if (screens.success.classList.contains("screen--active")) {
    startConfetti();
  }
});
