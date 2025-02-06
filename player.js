// x y 都是世界坐标系
// offsetX offsetY 是相机偏移量
// 所有物品的位置计算都使用世界坐标系
// 所有物品都在绘制时添加偏移量即可

class Player {

    // 构造函数
    constructor(x, y, speed, hp, imgIndex, levelIndex) {
        this.x = x;
        this.y = y;
        this.iniX = x; //记录出生点坐标
        this.iniY = y;
        this.speed = speed;
        this.maxhp = hp; // 最大血量
        this.hp = hp; // 当前血量, 初始值为最大血量
        this.levelIndex = levelIndex;
        this.diamondNum = 0;

        // 跳跃参数
        this.velocityY = 0; // 垂直速度
        this.gravity = 0.5; // 重力
        this.jumpStrength = -10; // 跳跃初速度
        this.onGround = false; // 是否在地面上

        // 帧动画参数
        this.frameCounter = 0; // 控制走路帧切换
        this.facingRight = true; // 记录人物方向
        this.frameIndex = 0; // 当前动画帧索引, 从0开始循环播放
        this.animationFrames = [imgIndex+9, imgIndex+10]; // 两个帧
            /* 帧动画这里以第一关为例, 选择索引是89/90切换
               由于tiled里面设置的是80, 因此这里+9 */

        // 无敌状态参数(被攻击后进入100帧无敌)
        this.visible = true; // 显示人物
        this.invincible = false; // 无敌状态
        this.invincibleTimer = 0; // 计时器
        this.invincibleDuration = 100; // 无敌持续时间
    }

    // 移动 + 限制玩家的位置
    update() {
        let newX = this.x;
        let newY = this.y;
        let moving = false; // 标记是否在移动

        this.beAttacked();
        this.beTrapped();
        this.getBox();
        this.getDiamond();

        // 判断人物是否入水
        if(this.inWater(this.x, this.y)){
            this.hp --;
            assets.deathSound.play();
            let message1 = "Don't jump into water!"
            messages.push(new Message(message1,width/2,4*height/5,3000,20,200,200,255,159,237));
            this.x = this.iniX;
            this.y = this.iniY;
            return;
        }

        if (keys['ArrowLeft']) {
            newX -= this.speed;
            this.facingRight = false;
            moving = true;
        }
        if (keys['ArrowRight']) {
            newX += this.speed;
            this.facingRight = true;
            moving = true;
        }

        // 角色移动帧动画交替
        if (moving) { 
            this.frameCounter++; // 计数器,每次update+1
            if (this.frameCounter % 10 === 0) { // 每10帧切换一次帧动画
                this.frameIndex = (this.frameIndex + 1) % this.animationFrames.length;
                this.imgIndex = this.animationFrames[this.frameIndex];
            }
        } else { // 角色静止, 帧动画停止
            this.imgIndex =this.animationFrames[0]; // 角色停下时帧动画停在第一个帧89
        }


        // 跳跃（仅当在地面上时才能跳）
        if (keys[" "] && this.onGround) {
            this.velocityY = this.jumpStrength; // 赋予向上的初速度
            this.onGround = false; // 进入空中
            assets.jumpSound.play();
        }

        // 施加重力
        this.velocityY += this.gravity; // 施加向下的重力加速度
        newY += this.velocityY;

        // 计算偏移量：让玩家始终保持在屏幕中心
        offsetX = this.x - windowWidth / 2;
        offsetY = this.y - windowHeight / 2;

        // 检查玩家四条边界是否碰撞: 每条边取两个点
        let left   = this.isColliding(newX, newY) || this.isColliding(newX, newY + tileSize/2);  // 左边上中两个点
        let right  = this.isColliding(newX + tileSize, newY) || this.isColliding(newX + tileSize, newY + tileSize/2);  // 右边上中两个点
        let top    = this.isColliding(newX + tileSize/3, newY) || this.isColliding(newX + 2*tileSize/3, newY) ;  // 上方中间两个点
        let bottom = this.isColliding(newX + tileSize/3, newY + tileSize) || this.isColliding(newX + 2*tileSize/3, newY + tileSize);  // 下方中间两个点

        // 处理水平碰撞
        if (!left && !right) { 
            this.x = newX; // 无碰撞可移动
        }
        // 处理垂直碰撞
        if (!top && !bottom) {
            this.y = newY;
            this.onGround = false; // 空中状态
        } else {
            if (this.velocityY > 0) { // 只有下落时才会停在地面上
                this.onGround = true;
            }
            this.velocityY = 0; // 停止竖直速度
        }

   }

  
    // 加载玩家图片到界面
    show() {

        // 在无敌状态下: 计时器增加+闪烁
        if (this.invincible) {
            this.invincibleTimer++;
            if (frameCount % 5 === 0) { // 每5帧切换一次显示
                this.visible = !this.visible;
            }
        } else {
            this.visible = true; // 恢复正常显示
        }

        // 停止无敌状态
        if (this.invincible && this.invincibleTimer >= this.invincibleDuration) {
            this.invincible = false;
            this.invincibleTimer = 0;
        }

        if(this.visible){
            //text(`${this.x},${this.y}`,this.x-offsetX,this.y-offsetY);
            let coordinate = getTilePosition(this.imgIndex);

            //保存当前的坐标系设定
            push();
            // 将坐标系原点平移到玩家上边缘的中心, 使用这个点来绘制玩家图形
            // 这样水平翻转时仍然基于这个点左右对称, 不用在image函数中拆分计算图形左上角坐标
            translate(this.x-offsetX+tileSize/2, this.y-offsetY);
            // 水平翻转, 如果facingRight则不变, 否则反转
            if (!this.facingRight) {
                scale(-1, 1); // 水平翻转
            }


            // 绘制玩家图像到画面上
            image(
                assets.icon,  // 源图像
                -tileSize/2, 0,   // 在画布上绘制的左上角坐标
                tileSize, tileSize,     // 在画布上绘制的宽度和高度
                coordinate.x, coordinate.y,  // 在png里的横坐标和纵坐标
                tileSize, tileSize      // 在png中要裁剪的宽度和高度
            );
            pop();//恢复之前的坐标系设定
        }
    }

    // 计算给定坐标是否在碰撞层
    isColliding(px, py) {
        let col = Math.floor(px / tileSize);
        let row = Math.floor(py / tileSize);
        let tileIndex = row * levelWidth[this.levelIndex] + col;

        // 碰撞检测：如果这个格子是碰撞体(非0), 返回 true
        return coll[this.levelIndex].data[tileIndex] !== 0;
    }

    // 计算是否碰到钻石
    getDiamond(){
        for(let i = 0; i < diamonds[selectedLevel].length; i++){
            if(diamonds[selectedLevel][i].visible && diamonds[selectedLevel][i].isNear(this.x,this.y)){
                assets.getDiamondSound.play();
                diamonds[selectedLevel][i].visible = false;
                this.diamondNum ++;
                console.log("人物钻石数量:", this.diamondNum);
            }
        }
    }

    // 计算是否碰到box
    getBox(){
        for(let i = 0; i < boxes[selectedLevel].length; i++){
            if(boxes[selectedLevel][i].visible && boxes[selectedLevel][i].isNear(this.x,this.y)){
                assets.getDiamondSound.play();
                boxes[selectedLevel][i].visible = false;
                let message1 = "Coming soon!"
                messages.push(new Message(message1,width/2,4*height/5,3000,20,200,200,255,200,51));
            }
        }
    }

    // 人物被敌人攻击(碰到敌人)
    beAttacked(){
        for(let i = 0; i < enemies[selectedLevel].length; i++){
            if(enemies[selectedLevel][i].visible && enemies[selectedLevel][i].isNear(this.x,this.y)){
                if(!this.invincible){ // 不在无敌状态时: hp--, 启动无敌状态
                    assets.beAttacked.play();
                    this.hp --;
                    this.invincible = true; 
                    this.invincibleTimer = 0; // 重置计时器
                }
            }
        }
    }

    // 人物被敌人攻击(碰到敌人)
    beTrapped(){
        for(let i = 0; i < traps[selectedLevel].length; i++){
            if(traps[selectedLevel][i].isNear(this.x,this.y)){
                if(!this.invincible){ // 不在无敌状态时: hp--, 启动无敌状态
                    assets.beAttacked.play();
                    this.hp --;
                    this.invincible = true; 
                    this.invincibleTimer = 0; // 重置计时器
                }
            }
        }
    }

    // 计算是否碰到水
    inWater(px, py){
        let col = Math.floor(px / tileSize);
        let row = Math.floor(py / tileSize);
        let tileIndex = row * levelWidth[this.levelIndex] + col;
        // 碰撞检测：如果这个格子是水, 返回真
        return water[this.levelIndex].data[tileIndex] !== 0;
    }


}
  