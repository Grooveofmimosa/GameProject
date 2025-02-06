// 单个敌人

class OneEnemy{

    // 构造函数
    constructor(x, y, speed, hp, range, imgIndex, levelIndex) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.maxhp = hp; // 最大血量
        this.hp = hp; // 当前血量, 初始值为最大血量
        this.range = range;// 可以运动的瓦片长度有多少个
        this.pixelRange = (range-1)*tileSize;

        this.levelIndex = levelIndex;
        this.imgIndex = imgIndex; // 图标起始坐标
        this.visible = true;// 被玩家打败后改为false

        // 敌人帧动画参数
        this.frameCounter = 0; // 计数器
        this.frameIndex = 0; // 当前动画帧索引, 从0开始循环播放
        this.animationFrames = [imgIndex, imgIndex+1]; // 两个帧

        // 敌人自动巡逻参数
        this.iniX = x; // 记录起始位置
        this.facingLeft = true; // 最开始都向左侧移动
    }

    beAttacked(){
        this.hp --;
        if(this.hp === 0){
            this.visible = false;
        }
    }

    // 根据敌人朝向更新坐标
    update() {
        if(this.visible){
            if(this.facingLeft){
                this.x -= this.speed;
            }else{
                this.x += this.speed;
            }
            // 如果到达最左或最右端，反转方向
            if (this.x <= this.iniX - this.pixelRange) {
                this.x = this.iniX - this.pixelRange; // 防止超出范围
                this.facingLeft = false; 
            } else if (this.x >= this.iniX) {
                this.x = this.iniX; // 防止超出范围
                this.facingLeft = true; 
            }
        }

    }

    show() {
        if(this.visible){
            // 自动切换帧动画
            this.frameCounter++;
            if (this.frameCounter % frameInterval === 0) { 
                this.frameIndex = (this.frameIndex + 1) % this.animationFrames.length;
                this.imgIndex = this.animationFrames[this.frameIndex];
            }

            // 计算偏移量
            //text(`${this.x},${this.y}`,this.x-offsetX,this.y-offsetY);
            let coordinate = getTilePosition(this.imgIndex);
            let offsetX = (player[this.levelIndex].x - windowWidth / 2);
            let offsetY = (player[this.levelIndex].y - windowHeight / 2);

            
            // 判断水平翻转再绘图
            push(); // 保存当前绘图状态
            // 根据偏移量移动坐标系
            translate(this.x-offsetX+tileSize/2, this.y-offsetY); 
            if (!this.facingLeft) {
                scale(-1, 1); // 水平翻转
            }
            image(
                assets.icon,
                -tileSize/2, 0,//此时不需要再计算偏移量
                tileSize, tileSize, // 画布位置
                coordinate.x, coordinate.y, 
                tileSize, tileSize // 裁剪区域
            );
            pop(); // 恢复绘图状态

        }
    }

    // 检查给定的点是否在附近
    isNear(px, py) {
        let d = -3; // 四边的d范围内
        // 将人物左上角化为中心点
        px += tileSize/2;
        py += tileSize/2;
        let centX = this.x + tileSize/2;
        let centY = this.y + tileSize/2;
        if (px >= (centX - tileSize - d) && px <= (centX + tileSize + d )
            && py >= (centY - tileSize - d) && py <= (centY + tileSize + d) ) {
            return true}
        else {return false}
    }

}