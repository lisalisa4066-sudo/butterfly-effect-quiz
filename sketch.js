let questions = [];
let results = [];
let currentQ = 0;
let score = 0;
let gameState = "MODE_SELECT"; 
let predatorX;
let predatorSpeed = 0.5;
let snakeBeauty = 0;
let butterflyY = 200;
let butterflyX = 500;
let cloud1X = 140;
let cloud2X = 550;

let btnSingleMode, btnBulkMode; 
let singleQInput, singleAInput; 
let bulkInput, addBtn, startBtn, answerInput, resetBtn, backBtn;

let questionStartTime = 0;
let timerDuration = 5;   
let maxBarWidth = 400;

let lastResult = null;    
let lastResultTime = 0;   
const RESULT_SHOW_MS = 1200; 

let TMINUS = { x: 310, y: 340, w: 36, h: 36 };
let TPLUS  = { x: 454, y: 340, w: 36, h: 36 };

let tableScrollY = 0;
let maxTableScroll = 0;

function setup() {
  createCanvas(800, 500);

  btnSingleMode = createButton('문제 하나씩 입력하기');
  btnSingleMode.style('width', '180px');
  btnSingleMode.style('height', '50px');
  btnSingleMode.style('background', '#4a90e2');
  btnSingleMode.style('color', '#fff');
  btnSingleMode.style('border', 'none');
  btnSingleMode.style('border-radius', '10px');
  btnSingleMode.style('font-size', '15px');
  btnSingleMode.style('font-weight', '700');
  btnSingleMode.style('cursor', 'pointer');
  btnSingleMode.mousePressed(() => switchState("INPUT_SINGLE"));

  btnBulkMode = createButton('문제 한번에 입력하기');
  btnBulkMode.style('width', '180px');
  btnBulkMode.style('height', '50px');
  btnBulkMode.style('background', '#5cb85c');
  btnBulkMode.style('color', '#fff');
  btnBulkMode.style('border', 'none');
  btnBulkMode.style('border-radius', '10px');
  btnBulkMode.style('font-size', '15px');
  btnBulkMode.style('font-weight', '700');
  btnBulkMode.style('cursor', 'pointer');
  btnBulkMode.mousePressed(() => switchState("INPUT_BULK"));

  singleQInput = createInput('');
  singleQInput.attribute('placeholder', '문제를 입력하세요.');
  singleQInput.style('width', '300px');
  singleQInput.style('height', '36px');
  singleQInput.style('padding', '0 10px');
  singleQInput.style('border', '2px solid #4a90e2');
  singleQInput.style('border-radius', '8px');

  singleAInput = createInput('');
  singleAInput.attribute('placeholder', '정답을 입력하세요.');
  singleAInput.style('width', '300px');
  singleAInput.style('height', '36px');
  singleAInput.style('padding', '0 10px');
  singleAInput.style('border', '2px solid #4a90e2');
  singleAInput.style('border-radius', '8px');

  bulkInput = createElement('textarea', '');
  bulkInput.attribute('placeholder', '여러 문제를 한 줄씩 입력하세요.\n(예시)\n문제1 / 정답1\n문제2 / 정답2');
  bulkInput.style('width', '360px');
  bulkInput.style('height', '110px');
  bulkInput.style('padding', '10px');
  bulkInput.style('border', '2px solid rgba(255,255,255,0.4)');
  bulkInput.style('border-radius', '8px');
  bulkInput.style('background', 'rgba(255,255,255,0.88)');
  bulkInput.style('font-size', '13px');
  bulkInput.style('outline', 'none');
  bulkInput.style('resize', 'none');

  addBtn = createButton('문제 등록');
  addBtn.style('width', '82px');
  addBtn.style('height', '32px');
  addBtn.style('background', '#5cb85c');
  addBtn.style('color', '#fff');
  addBtn.style('border', 'none');
  addBtn.style('border-radius', '8px');
  addBtn.style('font-size', '14px');
  addBtn.style('font-weight', '700');
  addBtn.style('cursor', 'pointer');
  addBtn.mousePressed(handleAddQuestions);

  startBtn = createButton('게임 시작');
  startBtn.style('width', '90px');
  startBtn.style('height', '32px');
  startBtn.style('background', '#337ab7');
  startBtn.style('color', '#fff');
  startBtn.style('border', 'none');
  startBtn.style('border-radius', '8px');
  startBtn.style('font-size', '14px');
  startBtn.style('font-weight', '700');
  startBtn.style('cursor', 'pointer');
  startBtn.mousePressed(startGame);

  answerInput = createInput('');
  answerInput.attribute('placeholder', '정답 입력 후 Enter');
  answerInput.style('width', '210px');
  answerInput.style('height', '36px');
  answerInput.style('padding', '0 12px');
  answerInput.style('border', '2.5px solid #337ab7');
  answerInput.style('border-radius', '8px');
  answerInput.style('background', 'rgba(255,255,255,0.93)');
  answerInput.style('font-size', '16px');
  answerInput.style('outline', 'none');
  answerInput.position(width / 2 - 105, height - 48);

  resetBtn = createButton('다시 시작');
  resetBtn.style('width', '90px');
  resetBtn.style('height', '32px');
  resetBtn.style('background', '#d9534f');
  resetBtn.style('color', '#fff');
  resetBtn.style('border', 'none');
  resetBtn.style('border-radius', '8px');
  resetBtn.style('font-size', '14px');
  resetBtn.style('font-weight', '700');
  resetBtn.style('cursor', 'pointer');
  resetBtn.mousePressed(resetGame);

  backBtn = createButton('처음으로');
  backBtn.style('width', '90px');
  backBtn.style('height', '32px');
  backBtn.style('background', '#777');
  backBtn.style('color', '#fff');
  backBtn.style('border', 'none');
  backBtn.style('border-radius', '8px');
  backBtn.style('font-size', '14px');
  backBtn.style('font-weight', '700');
  backBtn.style('cursor', 'pointer');
  backBtn.mousePressed(handleBackToMain);

  switchState("MODE_SELECT");
  predatorX = width;
}

function draw() {
  background(220, 240, 255);

  drawClouds();
  drawDistantMountains();
  drawMainHills();
  drawLeftTreeGroup();
  drawRightTrees();
  drawForegroundFlowerBed();

  if (gameState === "MODE_SELECT") {
    drawModeSelectScreen();
  } else if (gameState === "INPUT_SINGLE") {
    drawSingleInputScreen();
  } else if (gameState === "INPUT_BULK") {
    drawBulkInputScreen();
  } else if (gameState === "PLAY") {
    drawGameScreen();
  } else if (gameState === "WIN") {
    drawWinScreen();
  } else if (gameState === "LOSE") {
    drawEndScreen();
  }
}

function mouseWheel(event) {
  if (gameState === "WIN" || gameState === "LOSE") {
    if (mouseX >= 110 && mouseX <= 690 && mouseY >= 145 && mouseY <= 425) {
      tableScrollY += event.delta;
      tableScrollY = constrain(tableScrollY, 0, maxTableScroll);
      return false;
    }
  }
}

function touchMoved(event) {
  if (gameState === "WIN" || gameState === "LOSE") {
    if (mouseX >= 110 && mouseX <= 690 && mouseY >= 145 && mouseY <= 425) {
      tableScrollY += event.deltaY || (mouseX - pmouseX);
      tableScrollY = constrain(tableScrollY, 0, maxTableScroll);
      return false;
    }
  }
}

function switchState(nextState) {
  gameState = nextState;

  btnSingleMode.hide();
  btnBulkMode.hide();
  singleQInput.hide();
  singleAInput.hide();
  bulkInput.hide();
  addBtn.hide();
  startBtn.hide();
  answerInput.hide();
  resetBtn.hide();
  backBtn.hide();

  let cx = width / 2;
  let cy = height / 2;

  if (gameState === "MODE_SELECT") {
    btnSingleMode.position(cx - 190, cy - 25);
    btnBulkMode.position(cx + 10, cy - 25);
    btnSingleMode.show();
    btnBulkMode.show();
  } 
  else if (gameState === "INPUT_SINGLE") {
    singleQInput.position(cx - 150, cy - 80);
    singleAInput.position(cx - 150, cy - 30);
    backBtn.position(cx - 144, cy + 25);
    addBtn.position(cx - 44, cy + 25);
    startBtn.position(cx + 54,  cy + 25);
    singleQInput.show();
    singleAInput.show();
    backBtn.show();
    addBtn.show();
    startBtn.show();
  } 
  else if (gameState === "INPUT_BULK") {
    bulkInput.position(cx - 190, cy - 85);
    backBtn.position(cx - 144, cy + 45);
    addBtn.position(cx - 44, cy + 45);
    startBtn.position(cx + 54,  cy + 45);
    bulkInput.show();
    backBtn.show();
    addBtn.show();
    startBtn.show();
  }
}

function handleBackToMain() {
  questions = [];
  switchState("MODE_SELECT");
}

function handleAddQuestions() {
  if (gameState === "INPUT_SINGLE") {
    let qVal = singleQInput.value().trim();
    let aVal = singleAInput.value().trim();
    if (qVal !== "" && aVal !== "") {
      questions.push({ q: qVal, a: aVal });
      singleQInput.value('');
      singleAInput.value('');
    }
  } 
  else if (gameState === "INPUT_BULK") {
    let lines = bulkInput.value().split('\n');
    let validLines = [];
    let hasInvalid = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (line === "") continue;
      
      if (line.includes('/')) {
        let parts = line.split('/');
        let qVal = parts[0].trim();
        let aVal = parts[1].trim();
        if (qVal !== "" && aVal !== "") {
          validLines.push({ q: qVal, a: aVal });
        } else {
          hasInvalid = true;
        }
      } else {
        hasInvalid = true;
      }
    }

    if (!hasInvalid && validLines.length > 0) {
      questions = questions.concat(validLines);
      bulkInput.value('');
    }
  }
}

function startGame() {
  if (questions.length === 0) return;
  currentQ = 0;
  score = 0;
  snakeBeauty = 0;
  results = [];
  predatorSpeed = 490 / (timerDuration * 60);
  predatorX = width;
  butterflyX = 250;
  gameState = "PLAY";
  tableScrollY = 0;
  maxTableScroll = 0;

  singleQInput.hide();
  singleAInput.hide();
  bulkInput.hide();
  addBtn.hide();
  startBtn.hide();
  resetBtn.hide();
  backBtn.hide();
  answerInput.show();
  answerInput.value('');
  answerInput.elt.focus();
  resetTimer();
}

function resetGame() {
  questions = [];
  tableScrollY = 0;
  maxTableScroll = 0;
  switchState("MODE_SELECT");
}

function resetTimer() {
  predatorSpeed = 490 / (timerDuration * 60);
  questionStartTime = millis();
}

function finishGame() {
  answerInput.hide();
  let rate = score / questions.length;
  if (rate >= 0.8) {
    gameState = "WIN";
    butterflyX = 250;
  } else {
    gameState = "LOSE";
  }

  let rowH = 26;
  let totalRowsHeight = rowH * results.length;
  let visibleRowsHeight = 280 - rowH; 
  maxTableScroll = max(0, totalRowsHeight - visibleRowsHeight);
  tableScrollY = 0;

  resetBtn.position(width / 2 - 45, height - 30);
  resetBtn.show();
}

function handleTimeout() {
  results.push({
    q:       questions[currentQ].q,
    a:       questions[currentQ].a,
    userA:   '(시간 초과)',
    correct: false
  });

  if (snakeBeauty > 0) snakeBeauty--;
  lastResult = "timeout";
  lastResultTime = millis();
  predatorX -= 120;
  answerInput.value('');
  currentQ++;

  if (currentQ >= questions.length) {
    finishGame();
  } else {
    resetTimer();
  }
}

function keyPressed() {
  if (gameState === "PLAY" && keyCode === ENTER) checkAnswer();
}

function checkAnswer() {
  let userA     = answerInput.value().trim();
  let correctA  = questions[currentQ].a.trim();
  let isCorrect = userA === correctA;

  results.push({
    q:       questions[currentQ].q,
    a:       correctA,
    userA:   userA === '' ? '(미입력)' : userA,
    correct: isCorrect
  });

  if (isCorrect) {
    score++;
    snakeBeauty++;
    lastResult = "correct";
    predatorX += 150;
    if (predatorX > width) predatorX = width;
  } else {
    if (snakeBeauty > 0) snakeBeauty--;
    lastResult = "wrong";
    predatorX -= 120;
  }
  lastResultTime = millis();

  answerInput.value('');
  currentQ++;

  if (currentQ >= questions.length) {
    finishGame();
  } else {
    resetTimer();
  }
}

function mousePressed() {
  if (gameState !== "INPUT_SINGLE" && gameState !== "INPUT_BULK") return;
  if (hitBtn(TMINUS)) { if (timerDuration > 3)  timerDuration--; }
  if (hitBtn(TPLUS))  { if (timerDuration < 30) timerDuration++; }
}

function hitBtn(b) {
  return mouseX >= b.x && mouseX <= b.x + b.w &&
         mouseY >= b.y && mouseY <= b.y + b.h;
}

function drawRoundBtn(b, label, bg) {
  let hover = hitBtn(b);
  fill(red(bg), green(bg), blue(bg), hover ? 255 : 210);
  noStroke();
  rect(b.x, b.y, b.w, b.h, 8);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  textStyle(BOLD);
  text(label, b.x + b.w / 2, b.y + b.h / 2);
  textStyle(NORMAL);
}

function drawModeSelectScreen() {
  let cx = width / 2;
  let cy = height / 2;

  fill(255, 255, 255, 80);
  noStroke();
  rect(cx - 240, cy - 110, 480, 60, 16);
  
  fill(40, 40, 60);
  textAlign(CENTER, CENTER);
  textSize(24);
  textStyle(BOLD);
  text("학습용 퀴즈 게임: Butterfly Effect", cx, cy - 80);
  textStyle(NORMAL);
}

function drawSingleInputScreen() {
  let cx = width / 2;
  let cy = height / 2;

  fill(255, 255, 255, 60);
  noStroke();
  rect(cx - 140, cy - 135, 280, 40, 12);
  fill(40, 40, 60, 180);
  textAlign(CENTER, CENTER);
  textSize(16);
  text("문제 하나씩 입력하기", cx, cy - 115);

  drawCommonInputInterface(cx, cy + 65);
}

function drawBulkInputScreen() {
  let cx = width / 2;
  let cy = height / 2;

  fill(255, 255, 255, 60);
  noStroke();
  rect(cx - 140, cy - 140, 280, 45, 12);
  fill(40, 40, 60, 180);
  textAlign(CENTER, CENTER);
  textSize(16);
  text("문제 한번에 입력하기", cx, cy - 118);

  drawCommonInputInterface(cx, cy + 125);
}

function drawCommonInputInterface(cx, ty) {
  fill(255, 255, 255, 80);
  noStroke();
  rect(cx - 80, ty - 40, 160, 28, 8);
  fill(40, 40, 60, 160);
  textSize(14);
  textAlign(CENTER, CENTER);
  text("등록된 문제: " + questions.length + "개", cx, ty - 26);

  fill(255, 255, 255, 90);
  noStroke();
  rect(cx - 105, ty, 210, 56, 12);

  fill(40, 40, 60, 200);
  textAlign(CENTER, CENTER);
  textSize(13);
  text("⏱ 문제당 제한시간", cx, ty + 14);

  fill(25, 30, 70);
  textSize(17);
  textStyle(BOLD);
  text(timerDuration + " 초", cx, ty + 38);
  textStyle(NORMAL);

  let bY = ty + 10;
  drawRoundBtn({ x: cx - 100, y: bY, w: 36, h: 36 }, "−", color(200, 80, 80));
  drawRoundBtn({ x: cx +  64, y: bY, w: 36, h: 36 }, "+", color(50, 130, 200));

  TMINUS.x = cx - 100; TMINUS.y = bY;
  TPLUS.x  = cx +  64; TPLUS.y  = bY;
}

function drawGameScreen() {
  let charY = height / 2 + 130;
  drawCaterpillar(250, charY);
  drawPredator(predatorX, charY);

  fill(255, 255, 255, 170);
  noStroke();
  rect(width/2 - 300, 36, 600, 36, 10);
  fill(30, 30, 50);
  textAlign(CENTER, CENTER);
  textSize(18);
  text("Q" + (currentQ + 1) + ": " + questions[currentQ].q, width / 2, 54);

  let elapsedTime = (millis() - questionStartTime) / 1000;
  let timer = timerDuration - elapsedTime;
  if (timer <= 0) { timer = 0; handleTimeout(); return; }

  let barX     = width / 2 - maxBarWidth / 2;
  let barY     = 82;
  let barWidth = map(timer, 0, timerDuration, 0, maxBarWidth);
  let pct       = timer / timerDuration;
  let barG       = pct > 0.5 ? 200 : int(pct * 2 * 200);

  stroke(0, 0, 0, 30);
  strokeWeight(1);
  fill(255, 255, 255, 140);
  rect(barX, barY, maxBarWidth, 14, 7);
  noStroke();
  fill(255, barG, 80);
  rect(barX, barY, barWidth, 14, 7);

  fill(30, 30, 50, 160);
  textAlign(RIGHT, CENTER);
  textSize(12);
  text(nf(timer, 1, 1) + "s", barX + maxBarWidth, barY + 22);

  if (lastResult !== null && millis() - lastResultTime < RESULT_SHOW_MS) {
    let alpha = map(millis() - lastResultTime, 0, RESULT_SHOW_MS, 220, 0);
    let msg, bgR, bgG, bgB;
    if (lastResult === "correct") {
      msg = "✓ 정답!";
      bgR = 50; bgG = 180; bgB = 90;
    } else if (lastResult === "wrong") {
      msg = "✗ 오답";
      bgR = 210; bgG = 60; bgB = 60;
    } else {
      msg = "⏱ 시간 초과";
      bgR = 200; bgG = 130; bgB = 30;
    }
    fill(bgR, bgG, bgB, alpha * 0.35);
    noStroke();
    rect(barX, barY + 28, maxBarWidth, 26, 6);
    fill(bgR, bgG, bgB, alpha);
    textAlign(CENTER, CENTER);
    textSize(14);
    textStyle(BOLD);
    text(msg, width / 2, barY + 41);
    textStyle(NORMAL);
  }

  fill(255, 255, 255, 130);
  noStroke();
  rect(10, 10, 110, 26, 7);
  fill(30, 30, 50);
  textAlign(LEFT, CENTER);
  textSize(13);
  text("Score: " + score + " / " + questions.length, 18, 23);

  drawProgressBar();

  predatorX -= predatorSpeed;
  if (predatorX <= 310) {
    gameState = "LOSE";
    answerInput.hide();
    let rowH = 26;
    let totalRowsHeight = rowH * results.length;
    let visibleRowsHeight = 280 - rowH;
    maxTableScroll = max(0, totalRowsHeight - visibleRowsHeight);
    tableScrollY = 0;
    resetBtn.position(width / 2 - 45, height - 30);
    resetBtn.show();
  }
}

function drawProgressBar() {
  let total    = questions.length;
  let boxSize  = min(28, floor((width - 40) / total) - 4);
  let gap      = 4;
  let totalW   = total * (boxSize + gap) - gap;
  let startX   = width / 2 - totalW / 2;
  let py       = height - 20;

  fill(255, 255, 255, 150);
  noStroke();
  rect(startX - 10, py - boxSize - 6, totalW + 20, boxSize + 14, 8);

  for (let i = 0; i < total; i++) {
    let bx = startX + i * (boxSize + gap);
    let by = py - boxSize;

    if (i < results.length) {
      fill(results[i].correct ? color(60,190,100) : color(220,70,70));
      rect(bx, by, boxSize, boxSize, 5);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(boxSize * 0.65);
      text(results[i].correct ? "O" : "X", bx + boxSize / 2, by + boxSize / 2);

    } else if (i === currentQ) {
      fill(255, 220, 80, 220);
      stroke(255, 180, 0);
      strokeWeight(2);
      rect(bx, by, boxSize, boxSize, 5);
      noStroke();
      fill(80, 60, 20);
      textAlign(CENTER, CENTER);
      textSize(boxSize * 0.5);
      text(i + 1, bx + boxSize / 2, by + boxSize / 2);

    } else {
      fill(200, 210, 225, 180);
      noStroke();
      rect(bx, by, boxSize, boxSize, 5);
      fill(120, 130, 150);
      textAlign(CENTER, CENTER);
      textSize(boxSize * 0.5);
      text(i + 1, bx + boxSize / 2, by + boxSize / 2);
    }
  }
}

function drawWinScreen() {
  drawButterfly(butterflyX, butterflyY);
  butterflyX -= 4;
  butterflyY += sin(frameCount * 0.1) * 3;

  let rate = round((score / questions.length) * 100);

  fill(255, 255, 255, 185);
  noStroke();
  rect(width/2 - 220, 20, 440, 115, 16);
  fill(40, 140, 80);
  textAlign(CENTER, CENTER);
  textSize(50);
  text("VICTORY!", width / 2, 65);
  fill(50, 50, 70);
  textSize(16);
  text("애벌레가 나비가 되었습니다! 🎉", width / 2, 100);
  fill(80, 80, 100);
  textSize(13);
  text("최종 점수: " + score + " / " + questions.length + "  (" + rate + "%)", width / 2, 122);

  drawResultTable();
  resetBtn.position(width / 2 - 45, height - 30);
  resetBtn.show();
}

function drawEndScreen() {
  answerInput.hide();

  let rate = round((score / questions.length) * 100);

  fill(255, 255, 255, 185);
  noStroke();
  rect(width/2 - 220, 20, 440, 115, 16);
  fill(200, 50, 50);
  textAlign(CENTER, CENTER);
  textSize(50);

  if (predatorX <= 310) {
    text("GAME OVER", width / 2, 65);
    fill(80, 50, 50);
    textSize(16);
    text("포식자에게 잡혔습니다!", width / 2, 100);
  } else {
    text("GAME OVER", width / 2, 65);
    fill(80, 50, 50);
    textSize(16);
    text("정답률 80% 미달! 조금만 더 공부해요 📚", width / 2, 100);
  }

  fill(100, 70, 70);
  textSize(13);
  text("점수: " + score + " / " + questions.length + "  (" + rate + "%)", width / 2, 122);

  drawResultTable();
  resetBtn.position(width / 2 - 45, height - 30);
  resetBtn.show();
}

function drawResultTable() {
  let tableW = 580;
  let tableH = 280; 
  let rowH   = 26;
  let tx = width / 2 - tableW / 2;
  let ty = 145;

  fill(255, 255, 255, 210);
  noStroke();
  rect(tx, ty, tableW, tableH, 10);

  push();
  drawingContext.save();
  noStroke();
  rect(tx, ty + rowH, tableW, tableH - rowH);
  drawingContext.clip();

  translate(0, -tableScrollY);

  for (let i = 0; i < results.length; i++) {
    let r  = results[i];
    let ry = ty + rowH + i * rowH;

    if (i % 2 === 0) {
      fill(240, 245, 255, 180);
      noStroke();
      rect(tx, ry, tableW, rowH);
    }

    fill(40, 40, 60);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(i + 1, tx + 25, ry + rowH / 2); 

    textAlign(LEFT, CENTER);
    text(r.q,     tx + 60,            ry + rowH / 2);
    text(r.a,     tx + tableW * 0.52, ry + rowH / 2);
    fill(r.correct ? color(40,40,60) : color(200,60,60));
    text(r.userA, tx + tableW * 0.75, ry + rowH / 2);

    textAlign(CENTER, CENTER);
    if (r.correct) {
      fill(40, 160, 80);
      textSize(16);
      text("O", tx + tableW - 26, ry + rowH / 2);
    } else {
      fill(210, 50, 50);
      textSize(16);
      text("X", tx + tableW - 26, ry + rowH / 2);
    }

    stroke(210);
    strokeWeight(0.5);
    line(tx, ry + rowH, tx + tableW, ry + rowH);
  }
  drawingContext.restore();
  pop();

  fill(70, 100, 160, 200);
  noStroke();
  rect(tx, ty, tableW, rowH, 10, 10, 0, 0);

  fill(255);
  textSize(12);
  textAlign(CENTER, CENTER);
  text("번호",  tx + 25,            ty + rowH / 2);
  textAlign(LEFT, CENTER);
  text("문제",  tx + 60,            ty + rowH / 2);
  text("정답",  tx + tableW * 0.52, ty + rowH / 2);
  text("내 답", tx + tableW * 0.75, ty + rowH / 2);
  textAlign(CENTER, CENTER);
  text("결과",  tx + tableW - 26,   ty + rowH / 2);

  stroke(180);
  strokeWeight(0.5);
  line(tx, ty + rowH, tx + tableW, ty + rowH);

  if (maxTableScroll > 0) {
    let trackX = tx + tableW - 6;
    let trackY = ty + rowH + 2;
    let trackH = tableH - rowH - 4;
    
    let handleH = (trackH / (trackH + maxTableScroll)) * trackH;
    let handleY = trackY + (tableScrollY / maxTableScroll) * (trackH - handleH);
    
    noStroke();
    fill(0, 0, 0, 30);
    rect(trackX, trackY, 4, trackH, 2);
    fill(40, 40, 60, 120);
    rect(trackX, handleY, 4, handleH, 2);
  }
}

function drawClouds() {
  noStroke();
  fill(255, 255, 255, 200);
  cloud1X += 0.3;
  if (cloud1X > 850) cloud1X = -100;
  push();
  translate(cloud1X, 100);
  ellipse(0, 0, 90, 40); ellipse(-25, 5, 50, 35); ellipse(25, 5, 50, 35);
  pop();

  cloud2X += 0.2;
  if (cloud2X > 850) cloud2X = -100;
  push();
  translate(cloud2X, 80);
  ellipse(0, 0, 110, 45); ellipse(-30, 5, 60, 40); ellipse(30, 5, 60, 40);
  pop();
}

function drawDistantMountains() {
  noStroke();
  fill(165, 205, 180);
  beginShape();
  vertex(0, 500); bezierVertex(100,280,300,280,450,340); bezierVertex(550,380,700,300,800,350); vertex(800, 500);
  endShape(CLOSE);
  fill(150, 195, 165);
  beginShape();
  vertex(0, 500); bezierVertex(150,350,350,310,500,380); bezierVertex(650,330,750,340,800,400); vertex(800, 500);
  endShape(CLOSE);
}

function drawMainHills() {
  noStroke();
  fill(185, 220, 160);
  beginShape();
  vertex(0, 500); bezierVertex(200,350,450,340,650,420); bezierVertex(720,450,780,430,800,440); vertex(800, 500);
  endShape(CLOSE);
  fill(175, 215, 145);
  beginShape();
  vertex(0, 500); bezierVertex(100,460,300,410,550,440); bezierVertex(680,420,750,460,800,470); vertex(800, 500);
  endShape(CLOSE);
}

function drawLeftTreeGroup() {
  fill(210, 235, 185);
  ellipse(110, 440, 140, 70);
  drawSingleTree(70,  360, 55, 130, color(135,185,130), 0.03);
  drawSingleTree(120, 340, 65, 150, color(115,170,110), 0.02);
  drawSingleTree(180, 370, 50, 110, color(155,200,145), 0.04);
  drawSingleTree(145, 410, 45,  95, color(170,215,160), 0.025);
}

function drawSingleTree(x, y, w, h, leafColor, speed) {
  noStroke();
  fill(160, 125, 100);
  rect(x - w*0.1, y + h*0.4, w*0.2, h*0.4, 4);
  let sway = sin(frameCount * speed) * 3;
  fill(leafColor);
  push(); translate(x, y + h*0.4); rotate(radians(sway));
  ellipse(0, -h*0.3, w, h*0.8);
  pop();
}

function drawRightTrees() {
  let brown = color(160,125,100);
  let sway1 = sin(frameCount*0.02)*2, sway2 = sin(frameCount*0.03)*2.5;
  noStroke();
  fill(brown); rect(620,380,12,50,3);
  fill(130,175,140); push(); translate(626,430); rotate(radians(sway1)); ellipse(0,-60,45,75); pop();
  fill(brown); rect(660,395,10,40,3);
  fill(145,190,155); push(); translate(665,435); rotate(radians(sway2)); ellipse(0,-50,38,65); pop();
  fill(195,225,180); ellipse(380,410,50,25);
  fill(brown); rect(377,390,6,25,2);
  let sf = sin(frameCount*0.035)*2;
  fill(140,185,145);
  push(); translate(380,390); rotate(radians(sf));
  ellipse(0,-15,45,40); ellipse(-12,-10,25,25); ellipse(12,-10,25,25); ellipse(0,-27,30,25);
  drawMiniFlower(-8,-20); drawMiniFlower(10,-14);
  pop();
}

function drawMiniFlower(x, y) {
  fill(255);
  ellipse(x-3,y,6,6); ellipse(x+3,y,6,6); ellipse(x,y-3,6,6); ellipse(x,y+3,6,6);
  fill(245,220,140); ellipse(x,y,4,4);
}

function drawForegroundFlowerBed() {
  fill(145,190,120); noStroke();
  beginShape(); vertex(0,500);
  let t = frameCount * 0.02;
  for (let x = 0; x <= 800; x += 40) {
    let y = 400 + sin(x*0.05+t)*6;
    vertex(x,y); vertex(x+15,y-12); vertex(x+30,y);
  }
  vertex(800,500); endShape(CLOSE);
  randomSeed(99);
  for (let i = 0; i < 28; i++) {
    let fx = map(i,0,27,20,780) + random(-5,5);
    let fy = 430 + (i%3)*10;
    let fsw = sin(frameCount*0.04+i)*4;
    drawLandscapeFlower(fx+fsw, fy+sin(frameCount*0.02+i)*2, random(12,18));
  }
}

function drawLandscapeFlower(x, y, size) {
  fill(255); noStroke();
  let r = size * 0.4;
  ellipse(x-r,y,r*1.2,r*1.2); ellipse(x+r,y,r*1.2,r*1.2);
  ellipse(x,y-r,r*1.2,r*1.2); ellipse(x,y+r,r*1.2,r*1.2);
  if (size > 15) {
    ellipse(x-r*.7,y-r*.7,r*1.2,r*1.2); ellipse(x+r*.7,y-r*.7,r*1.2,r*1.2);
    ellipse(x-r*.7,y+r*.7,r*1.2,r*1.2); ellipse(x+r*.7,y+r*.7,r*1.2,r*1.2);
  }
  fill(250,230,150); ellipse(x,y,size*0.5,size*0.5);
}

function drawCaterpillar(x, y) {
  push();
  translate(x,y);
  noStroke();
  for (let i = 4; i >= 0; i--) {
    let col = color(155,220,125);
    if (snakeBeauty > (4-i)) {
      colorMode(HSB);
      col = color((frameCount*5+i*30)%360, 70, 100);
      colorMode(RGB);
    }
    fill(col);
    ellipse(i*30, sin(frameCount*0.15+i*0.8)*10, 55, 45);
  }
  let hw = sin(frameCount*0.15)*5;
  translate(-35, hw-5);
  fill(125,200,100);
  ellipse(0,0,60,55);
  fill(255);
  ellipse(-13,-10,15,15);
  ellipse(-13,10,15,15);
  fill(0);
  ellipse(-16,-10,6,6);
  ellipse(-16,10,6,6);
  fill(255,170,190);
  ellipse(-25,17,13,9);
  stroke(80,150,70);
  strokeWeight(4);
  line(10,-23,20,-50);
  line(-10,-23,-20,-50);
  noStroke();
  fill(255,245,170);
  ellipse(20,-52,10,10);
  ellipse(-20,-52,10,10);
  pop();
}

function drawPredator(x, y) {
  push();
  translate(x,y);
  scale(-1,1);
  noStroke();
  fill(80,170,255);
  let mo = map(sin(frameCount*0.2),-1,1,10,45);
  arc(0,0,140,140, radians(mo), radians(360-mo), PIE);
  fill(255);
  ellipse(5,-35,22,22);
  fill(0);
  ellipse(9,-35,10,10);
  pop();
}

function drawButterfly(x, y) {
  push();
  translate(x,y);
  let ws = sin(frameCount*0.3)*40;
  fill(255,100,200);
  ellipse(-15,-ws/2,40,60);
  ellipse(15,-ws/2,40,60);
  fill(255,200,0);
  ellipse(-15, ws/2,30,40);
  ellipse(15, ws/2,30,40);
  fill(50);
  ellipse(0,0,10,50);
  pop();
}