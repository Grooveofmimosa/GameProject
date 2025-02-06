let gameState = "start"; // 当前游戏状态
let levels = [1, 2, 3, 4, 5];  // 关卡列表
let selectedLevel = 0;  // 选中的关卡索引, 从0开始
let firstGameStarted = true; // 游戏首次开始标志,用于显示游戏提示


function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(assets.font1);
  assets.bgm.setVolume(1);  // 设置音量
  assets.bgm.loop();  // 循环播放
}

function draw() {
  background(200);

  // 画面过渡效果
  if (transitioning) {
    imgAlpha += 5; // 让透明度逐渐增加
    textAlpha += 5;
    if (imgAlpha >= 255) {
      imgAlpha = 255;
      transitioning = false;
    }
    if (textAlpha >= 255) {
      textAlpha = 255; 
    }
  }

  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "levelSelect") {
    drawLevelSelectScreen();
  } else if (gameState === "playing") {
    drawGameScreen();
  } else if (gameState === "gameOver") {
    drawGameOverScreen();
  } else if (gameState === "levelComplete") {
    drawLevelCompleteScreen();
  }

  //测试

}

// 开始界面
function drawStartScreen() {
  background(100, 150, 200);
  tint(255, imgAlpha);// 改变图片的透明度
  image(assets.startPage,0,0,width*1.5,height);
  noTint();
  textAlign(CENTER, CENTER);
  textSize(32);
  strokeWeight(3);
  //text("Press ENTER to start", width/2, height/2);
  flashText("Press ENTER to start", width/2, height/2, 
              alphaSpeed, 255, 255, 255, 255,159,237);
}

// 关卡选择界面
function drawLevelSelectScreen() {
  background(137,172,206);
  tint(255, imgAlpha);// 改变图片的透明度
  //...这里插入关卡选择背景图片
  noTint();
  textAlign(CENTER, CENTER);
  textSize(28);
  fill(0,0,0,textAlpha);
  strokeWeight(3);
  stroke(255,255,255,textAlpha);
  text("Use LEFT/RIGHT to chose\nPress SPACE to begin", width/2, 100);

  for (let i = 0; i < levels.length; i++) {
    let size = 60;
    let x = width/2 - (levels.length*size)/2 + i*size; // 计算按钮位置
    let y = height/2;
    if (i === selectedLevel) {
      fill(255, 255, 0 ,textAlpha); // 选中时候的颜色
    } else {
      fill(200, 200, 200, textAlpha);
    }
    rect(x, y, size, size, 10); // 画按钮
    fill(0,0,0,textAlpha);
    textSize(26);
    strokeWeight(3);
    stroke(255,255,255,textAlpha);
    text(levels[i], x + size/2, y + size/2); // 画按钮上的文字
  }
}

// 游戏界面
function drawGameScreen() {
  tint(255, imgAlpha);// 改变图片的透明度
  image(assets.bg, 0, 0, windowWidth, windowHeight*5/4);
  noTint();
  // 死亡
  if (player[selectedLevel].hp === 0) {
    assets.deathSound.play();
    gameState = "gameOver";
  }

  // 绘制所有图层
  coll[selectedLevel].show();
  water[selectedLevel].update();
  water[selectedLevel].show();
  others[selectedLevel].show();
  for(let i =0; i<enemies[selectedLevel].length; i++){
    enemies[selectedLevel][i].update();
    enemies[selectedLevel][i].show();
  }
  for(let i =0; i<traps[selectedLevel].length; i++){
    traps[selectedLevel][i].show();
  }
  for(let i =0; i<diamonds[selectedLevel].length; i++){
    diamonds[selectedLevel][i].show();
  }
  for(let i =0; i<boxes[selectedLevel].length; i++){
    boxes[selectedLevel][i].show();
  }
  flag[selectedLevel].show();
  player[selectedLevel].update();
  player[selectedLevel].show();
  
  // 判定是否触碰旗帜结束当前关卡
  if (flag[selectedLevel].isNear(player[selectedLevel].x, player[selectedLevel].y)) {
    assets.levelClearSound.play();
    gameState = "levelComplete";
  }

  // 首次开始游戏显示操作提示
  if(firstGameStarted){
    //textAlign(CENTER, CENTER); 
    textSize(20);
    let message1 = "Press LEFT/RIGHT ARROW to move\nPress SPACE to jump";
    messages.push(new Message(message1,width/2,4*height/5,3000,20,200,200,255,159,237));
    firstGameStarted = false;
  }
  // 显示所有提示消息
  for (let i = 0; i < messages.length; i++) {
    messages[i].show();
  }
  // 删除已过期的第一条消息
  if (messages.length > 0 && messages[0].isExpired()) {
    messages.shift();
  }
  // 页面常驻消息
  rectMode(CORNER);
  fill(255,159,237,textAlpha);
  textSize(15);
  strokeWeight(2);
  stroke(255,255,255,textAlpha);
  textAlign(LEFT,TOP);
  text(`Level: ${selectedLevel}`, 30, 30);
  text(`HP: ${player[selectedLevel].hp}`, 30, 60);
  text(`Diamonds: ${player[selectedLevel].diamondNum} / ${diamonds[selectedLevel].length}`, 30, 90);
}


// 死亡界面
function drawGameOverScreen() {
  background(255, 0, 0);
  textAlign(CENTER, CENTER);
  textSize(25);
  fill(255,255,255,textAlpha);
  strokeWeight(2);
  stroke(0,0,0,textAlpha);
  text("GameOver!\nPress R to restart", width/2, height/2);
  // 重置游戏数据
  for(let i=0; i<player.length; i++){
    player[selectedLevel].hp = player[selectedLevel].maxhp;
    player[selectedLevel].diamondNum = 0;
    player[selectedLevel].x = player[selectedLevel].iniX;
    player[selectedLevel].y = player[selectedLevel].iniY;
    player[selectedLevel].invincible = false;
  }
  for(let i=0; i<diamonds.length; i++){
    diamonds[selectedLevel][i].visible = true;
  }
  for(let i=0; i<boxes.length; i++){
    boxes[selectedLevel][i].visible = true;
  }
  for(let i=0; i<enemies[selectedLevel].length; i++){
    enemies[selectedLevel][i].visible = true;
    enemies[selectedLevel][i].hp = enemies[selectedLevel][i].maxhp;
  }
}

// 关节结束画面
function drawLevelCompleteScreen() {
  background(123, 180, 145);
  tint(255, imgAlpha);// 改变图片的透明度
  //...这里插入关卡选择背景图片
  noTint();
  textAlign(CENTER, CENTER);
  textSize(26);
  fill(0, 0, 0, textAlpha);
  strokeWeight(3);
  stroke(255, 255, 255, textAlpha);
  text("Level Complete!", width/2, height/2 - 50);
  textSize(20);
  strokeWeight(2);
  text("Press ANY KEY for next level", width/2, height/2 +50);
  text("Press ESC to return to level select", width/2, height/2 +100);
}


// 监听键盘输入来切换场景
function keyPressed() {
  if (gameState === "start" && keyCode === ENTER) {
    gameState = "levelSelect";
    assets.clicked.play();
    transition();
  } else if (gameState === "levelSelect") {
    if (keyCode === LEFT_ARROW) {
      selectedLevel = max(0, selectedLevel - 1);
    } else if (keyCode === RIGHT_ARROW) {
      selectedLevel = min(levels.length - 1, selectedLevel + 1);
    } else if (keyCode === 32) {  // 空格键进入关卡
      gameState = "playing";
      assets.clicked.play();
      transition();
    }
  } else if (gameState === "gameOver" && key === 'r') {
    gameState = "start";
    assets.clicked.play();
    transition();
  }
  else if(gameState ==="playing"){
    keys[key] = true;//控制人物移动和交互
    console.log(key + " " + keyCode);//调试信息
  }
  else if (gameState === "levelComplete") {
    // 按 ESC 返回关卡选择
    if (keyCode === ESCAPE) {
      gameState = "levelSelect";
      transition();
    } else {
      // 进入下一关
      if (selectedLevel < levels.length - 1) {
        selectedLevel++;
        gameState = "playing";
      } else {
        gameState = "levelSelect"; // 如果是最后一关, 回到关卡选择
      }
      transition();
    }
  }
}

// 松开键盘后停止人物移动
function keyReleased() {
  if (keys[key] !== undefined) {
    keys[key] = false;
  }
}

