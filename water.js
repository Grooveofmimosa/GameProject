// 一个关卡的所有水域, 实现玩家触碰hp-1, 并重置回出生点
class Water{
    // 构造函数
    constructor(data, levelIndex) {
        this.data = data;
        this.levelIndex = levelIndex;

        // 帧动画控制相关
        this.frameCounter = 0; // 计数器
        // 复制数组, 非0水域索引+2
        this.nextFrameData = new Array(this.data.length);
        for (let i = 0; i < this.data.length; i++) {
            this.nextFrameData[i] = this.data[i];
            if(this.nextFrameData[i] !== 0){
                this.nextFrameData[i] += 2;
            }
        }
        // 让它每隔一段时间指向原数组或新数组,用以控制显示哪个帧
        this.nowFrameData = this.data;
    }

    // 更新帧动画
    update(){
        this.frameCounter++; // 计数器
        if (this.frameCounter % frameInterval === 0) { // 每20帧切换一次
            if (this.nowFrameData === this.data) {
                this.nowFrameData = this.nextFrameData;
            } else {
                this.nowFrameData = this.data;
            }
        }
    }

    // 将整个层绘制到界面
    show() {
        
        let offsetX = (player[this.levelIndex].x - windowWidth / 2);
        let offsetY = (player[this.levelIndex].y - windowHeight / 2);
        for(let i = 0; i < this.nowFrameData.length; i++){
            let tileId = this.nowFrameData[i];  // 当前瓦片的在瓦片表中的索引
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