// others层, 代码和coll类一样, 只是这个类不用来计算碰撞体积

class Others{
    // 构造函数
    constructor(data, levelIndex) {
        this.data = data;
        this.levelIndex = levelIndex;
    }
    // 将整个层绘制到界面
    show() {
        let offsetX = (player[this.levelIndex].x - windowWidth / 2);
        let offsetY = (player[this.levelIndex].y - windowHeight / 2);
        for(let i=0; i<this.data.length; i++){
            let tileId = this.data[i];  // 当前瓦片的在瓦片表中的索引
            if (tileId === 0) {
                continue;  // 跳过无内容的区域
            }
            let coord1 = getTilePosition(tileId);//当前瓦片在瓦片表中的坐标
            let coord2 = getDrawPosition(i, this.levelIndex);//应该画在画布的坐标
            image(
                assets.icon,  
                coord2.x-offsetX, coord2.y-offsetY,  
                tileSize, tileSize,    
                coord1.x, coord1.y,  
                tileSize, tileSize      
            );
        }
    }
}