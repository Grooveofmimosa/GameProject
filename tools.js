// 工具类


// ================ 所有的初始化变量 ===============

let windowHeight = 350; // 记录窗口大小
let windowWidth = 500;


let levelHeight = []; // 记录每个关卡的宽高(几个瓦片)
// 其中levelHeight[0]代表第一关的高度(瓦片数),这个值在level1.js里设定
let levelWidth = [];
let tileSize = 21;
let tilemargin = 2;

let offsetX = 0;  // 水平偏移
let offsetY = 0;  // 垂直偏移
//let cameraSpeed = 5; // 镜头的移动速度，控制视窗跟随的灵敏度

let frameInterval = 18; // 控制场景帧动画切换都是18帧一换

let keys = {}; // 空对象用于存储当前按键信息,控制人物持续移动
let messages = []; // 用于存储所有的提示消息(固定时间消失)


// ================ 获取对象存入数组 ==================

// 碰撞层
let coll = []; // coll[0] 是第一关的碰撞层对象, 对象中包括多个属性, 如data属性是一个数组
let others = [];
let water = [];

// 对象层
let player = []; // 玩家类的对象,用于存储json中获得的数据
                // player[0] 是第一关的玩家对象, 以此类推  

let flag = []; // flag[0] 是第一关的旗对象, 以此类推
let enemies = []; // enemies[0] 是第一关的敌人对象数组, 这之中又包括每一个第一关的敌人

let traps = []; 
let diamonds = [];
let boxes = [];


// ================== 工具函数 =====================

// 根据索引(从1开始,30一行)计算瓦片在瓦片素材表png里的坐标{x,y}
function getTilePosition(i) {
    let row = Math.floor((i - 1) / 30);  // 行号
    let col = (i - 1) % 30;              // 列号
    let xCoordinate = col * (tileSize + tilemargin) + 2;  // 横坐标
    let yCoordinate = row * (tileSize + tilemargin) + 2;  // 纵坐标
    return { x: xCoordinate, y: yCoordinate };
}

// 根据data数组中某个索引获得应该画在画布的哪个位置
function getDrawPosition(i, levelIndex) {
    let row = Math.floor(i / levelWidth[levelIndex]);  // 计算当前瓦片在地图中的行
    let col = i % levelWidth[levelIndex];  // 计算当前瓦片在地图中的列
    let xCoordinate = col * tileSize;  // 计算绘制到画布上的 x 坐标
    let yCoordinate = row * tileSize;  // 计算绘制到画布上的 y 坐标
    return { x: xCoordinate, y: yCoordinate };
}

// 文字透明度闪烁效果函数
let alphaValue = 0;  // 文字的透明度
let alphaSpeed = 5;  // 透明度变化的速度
let increasing = true; // 控制透明度是否增加
let holdTime = 30;  // 停留在最大透明度时的帧数
let holdCounter = 0;  // 计时器

function flashText(textContent, x, y, speed, r, g, b,
                     r1=255, g1=255, b1=255) {
    // rgb是文字颜色, r1g1b1是边框颜色, 默认白色
    if (increasing) {
        alphaValue += speed; // 透明度增加
        if (alphaValue >= 255) {
            alphaValue = 255; // 达到最大透明度
            increasing = false; // 改为减少透明度
            holdCounter = holdTime; // 开始计时停留
        }
    } else {
        if (holdCounter > 0) {
            holdCounter--; // 保持最大透明度一段时间
        } else {
            alphaValue -= speed; // 透明度减少
            if (alphaValue <= 0) {
                alphaValue = 0; // 达到最小透明度
                increasing = true; // 改为增加透明度
            }
        }
    }
    fill(r, g, b, alphaValue); // 设置带透明度的颜色
    stroke(r1, g1, b1, alphaValue);
    text(textContent, x, y); // 绘制文字
}

// 画面转化的过渡效果
let transitioning = true; // 标记是否正在画面过渡
let imgAlpha = 0;   // 图片透明度
let textAlpha = 0;  // 文字的透明度
// 界面转换标记函数(每次界面转换都调用这个函数来重置控制变量)
function transition() {
  imgAlpha = 0;
  textAlpha = 0;
  transitioning = true;
}