// Global Variables
const svgW3 = "http://www.w3.org/2000/svg";
const circle = document.createElementNS(svgW3, "circle");
const playSize = 1080;
const svg = document.createElementNS(svgW3, "svg");

function setup() {
  const width = 1920;
  const height = 1080;

  const container = document.createElement("div");
  document.body.append(container);

  container.style.position = "fixed";
  container.style.left = 0;
  container.style.right = 0;
  container.style.top = 0;
  container.style.bottom = 0;

  container.style.backgroundColor = "mintcream";

  const canvas = document.createElement("div");
  canvas.style.width = width;
  canvas.style.height = height;

  canvas.style.borderRadius = "50px";
  canvas.style.borderColor = "black";
  canvas.style.borderStyle = "dotted";

  const borderWidth = 5;
  canvas.style.borderWidth = borderWidth;

  container.appendChild(canvas);

  canvas.style.scale = Math.min(
    window.innerHeight / (height + borderWidth * 2),
    window.innerWidth / (width + borderWidth * 2)
  );

  canvas.style.transformOrigin = "top left";

  window.onresize = () => {
    canvas.style.scale = Math.min(
      window.innerHeight / (height + borderWidth * 2),
      window.innerWidth / (width + borderWidth * 2)
    );
  };

  svg.setAttributeNS(
    "http://www.w3.org/2000/xmlns/",
    "xmlns:xlink",
    "http://www.w3.org/1999/xlink"
  );

  svg.style.backgroundColor = "thistle";

  svg.setAttribute("viewBox", `0 0 ${playSize} ${playSize}`);
  svg.setAttribute("width", playSize);
  svg.setAttribute("height", playSize);

  canvas.append(svg);

  const circleSize = 50;
  circle.setAttribute("r", circleSize);
  circle.setAttribute("cx", playSize / 2);
  circle.setAttribute("cy", playSize / 2);
  circle.setAttribute("fill", "darkseagreen");
  svg.append(circle);

  canvas.style.display = "flex";
  canvas.style.alignItems = "center";
  canvas.style.justifyContent = "center";

  circle.setAttribute("facing", "right");
}

// Movement Code

const move = (element) => {
  const direction = element.getAttribute("facing");
  const x = +element.getAttribute("cx");
  const y = +element.getAttribute("cy");
  const dx = 10;
  const dy = 10;
  const size = +element.getAttribute("r");

  switch (direction) {
    case "left":
      const leftX = x - dx;
      element.setAttribute("cx", leftX + size >= 0 ? leftX : playSize + size);
      break;
    case "right":
      const rightX = x + dx;
      element.setAttribute("cx", rightX - size <= playSize ? rightX : -size);
      break;
    case "up":
      const upY = y - dy;
      element.setAttribute("cy", upY + size >= 0 ? upY : playSize + size);
      break;
    case "down":
      const downY = y + dy;
      element.setAttribute("cy", downY - size <= playSize ? downY : -size);
      break;
  }
};

window.onkeydown = (e) => {
  e.preventDefault();
  switch (e.key) {
    case "a":
    case "ArrowLeft":
      circle.setAttribute("facing", "left");
      break;
    case "d":
    case "ArrowRight":
      circle.setAttribute("facing", "right");
      break;
    case "w":
    case "ArrowUp":
      circle.setAttribute("facing", "up");
      break;
    case "s":
    case "ArrowDown":
      circle.setAttribute("facing", "down");
      break;
  }

  move(circle);
};

setInterval(() => {
  move(circle);
}, 100);

let level = 1;
const savedLevel = new URLSearchParams(location.search).get("level");
if (savedLevel) {
  level = +savedLevel;
}

const snowAmount = level * 10;
const snowSize = 10;

const snowGroup = document.createElementNS(svgW3, "g");
svg.append(snowGroup);

for (let i = 0; i < snowAmount; i++) {
  const snow = document.createElementNS(svgW3, "circle");
  snow.setAttribute("fill", "snow");
  snow.setAttribute("cx", Math.random() * playSize);
  snow.setAttribute("cy", Math.random() * playSize);
  snow.setAttribute("r", snowSize);
  snow.setAttribute("facing", "down");
  snowGroup.append(snow);

  setInterval(() => {
    move(snow);
  }, 50 + Math.random() * 50);
}

// HUD

let caughtCount = 0;
const caughtLabel = document.createElementNS(svgW3, "text");
caughtLabel.setAttribute("x", 50);
caughtLabel.setAttribute("y", 100);
caughtLabel.style.fill = "moccasin";
caughtLabel.textContent = `❄️ SNOW CAUGHT ${caughtCount} / ${snowAmount}`;
caughtLabel.style.font = "normal 30px sans-serif";
svg.append(caughtLabel);

const levelLabel = document.createElementNS(svgW3, "text");
levelLabel.setAttribute("x", 50);
levelLabel.setAttribute("y", 60);
levelLabel.style.fill = "moccasin";
levelLabel.textContent = `Level ${level}`;
levelLabel.style.font = "bold 30px sans-serif";
svg.append(levelLabel);

let startTime = new Date().getTime();

let collisionCheck = () => {
  if (caughtCount === snowAmount) {
    const win = document.createElementNS(svgW3, "text");
    win.setAttribute("x", playSize / 2);
    win.setAttribute("y", playSize / 2);
    win.setAttribute("text-anchor", "middle");
    win.style.fill = "slategray";
    win.textContent = `🎉 YOU WIN!!!`;
    win.style.font = "bold 100px sans-serif";
    svg.append(win);

    currentTime = new Date().getTime();
    const differenceInMS = currentTime - startTime;
    const differenceInSeconds = Math.round(differenceInMS / 1000);

    const stats = document.createElementNS(svgW3, "text");
    stats.setAttribute("x", playSize / 2);
    stats.setAttribute("y", playSize / 2 + 50);
    stats.setAttribute("text-anchor", "middle");
    stats.style.fill = "slategray";
    stats.textContent = `LEVEL ${level} COMPLETED IN ${differenceInSeconds} SECONDS`;
    stats.style.font = "normal 40px sans-serif";
    svg.append(stats);

    const startNextLevel = document.createElementNS(svgW3, "text");
    startNextLevel.setAttribute("x", playSize / 2);
    startNextLevel.setAttribute("y", playSize / 2 + 100);
    startNextLevel.setAttribute("text-anchor", "middle");
    startNextLevel.style.fill = "slategray";
    startNextLevel.textContent = `CLICK ANYWHERE TO START NEXT LEVEL`;
    startNextLevel.style.font = "bold 40px sans-serif";
    svg.append(startNextLevel);

    window.onclick = () => {
      const nextLevel = level + 1;
      const nextLevelURL = new URLSearchParams();
      nextLevelURL.set("level", nextLevel);
      window.location.search = nextLevelURL.toString();
    };
  }

  const circleIntersect = (circleOne, circleTwo) => {
    return (
      Math.hypot(circleOne.x - circleTwo.x, circleOne.y - circleTwo.y) <=
      circleOne.size + circleTwo.size
    );
  };

  for (const snow of snowGroup.children) {
    const snowX = +snow.getAttribute("cx");
    const snowY = +snow.getAttribute("cy");
    const snowSize = +snow.getAttribute("r");

    const circleOne = {
      x: snowX,
      y: snowY,
      size: snowSize,
    };

    const circleTwo = {
      x: +circle.getAttribute("cx"),
      y: +circle.getAttribute("cy"),
      size: +circle.getAttribute("r"),
    };

    const doesIntersect = circleIntersect(circleOne, circleTwo);
    if (doesIntersect) {
      snowGroup.removeChild(snow);
      caughtCount++;
      caughtLabel.textContent = `❄️ SNOW CAUGHT ${caughtCount} / ${snowAmount}`;
    }
  }

  window.requestAnimationFrame(() => {
    collisionCheck();
  });
};

collisionCheck();

/*function addText(name, x, y, center, color, text, font) {
  let name = document.createElementNS(svgW3, "text");
  name.setAttribute("x", x);
  name.setAttribute("y", y);
  if (center === true) {
    name.setAttribute("text-anchor", "middle");
  }
  name.style.fill = color;
  name.textContent = text;
  name.style.font = font;
  svg.append(name);
}

addText("Hello", 200, 200, true);*/
