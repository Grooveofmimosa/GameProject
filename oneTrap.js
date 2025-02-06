// 陷阱层, 一个类是一个陷阱


class OneTrap{

    // 构造函数
    constructor(x, y, imgIndex, levelIndex) {
        this.x = x;
        this.y = y;
        this.levelIndex = levelIndex;
        this.imgIndex = imgIndex; // 图标起始坐标
    }

    show() {
        //text(`${this.x},${this.y}`,this.x-offsetX,this.y-offsetY);
        let coordinate = getTilePosition(this.imgIndex);
        let offsetX = (player[this.levelIndex].x - windowWidth / 2);
        let offsetY = (player[this.levelIndex].y - windowHeight / 2);
        image(
            assets.icon,  // 源图像
            this.x-offsetX, this.y-offsetY,   // 在画布上绘制的左上角坐标
            tileSize, tileSize,     // 在画布上绘制的宽度和高度
            coordinate.x, coordinate.y,  // 在png里的横坐标和纵坐标
            tileSize, tileSize      // 在png中要裁剪的宽度和高度
        );
    }

    // 检查给定的点是否在附近
    isNear(px, py) {
        let d = 0; // 四边的d范围内
        // 将人物左上角化为中心点
        px += tileSize/2;
        py += tileSize/2;
        // 将陷阱左上角化为中心点
        let centX = this.x + tileSize/2;
        let centY = this.y + tileSize/2;
        if (px >= (centX - tileSize - d) && px <= (centX + tileSize + d )
            && py >= (centY - tileSize - d) && py <= (centY + tileSize + d) ) {
            return true}
        else {return false}
    }

}