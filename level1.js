let Level1Data = {};  // 用于存储解析后的JSON数据,它是一个对象


let levelIndex = 0;


player[levelIndex] = null;
enemies[levelIndex] = []; // 初始化为一个数组
traps[levelIndex] = [];
diamonds[levelIndex] = [];
boxes[levelIndex] = [];


// 解析 JSON 地图
function ParseJSON(jsonData) {
    Level1Data = jsonData;  // 将解析后的 JSON 赋值给 gameData
    console.log("JSON 解析后:", Level1Data);
    levelHeight[levelIndex] = 30;
    levelWidth[levelIndex] = 100; 
    /* 这些是对json文件数据的操作, 必须放在这个函数里, 因为若放在外面就是异步操作
       不能保证json文件已经解析完成, 会报错undifined  */
    getPlayers();
    getColl();
    getOthers();
    getEnemies();
    getTraps();
    getInteract();
    getWater();
    
}

// 使用 $.getJSON 加载 JSON 
$.getJSON('assets/test03.json', ParseJSON);

// 获取玩家数据并存储到玩家类的对象
function getPlayers(){
    let playerLayer = Level1Data.layers.find(layer => layer.name === "player");
    //console.log(playerLayer); //
    // 从玩家对象层获取玩家对象
    let playerObject = playerLayer.objects.find(player => player.name === "player1");
    //console.log("玩家对象:",playerObject); //
    // 获取玩家对象的自定义属性:  speed 和 HP
    let speed = playerObject.properties.find(properties => properties.name === "speed").value;
    let hp = playerObject.properties.find(properties => properties.name === "hp").value;
    //console.log(player1Speed); //2
    //console.log(player1HP); //5
    // 获取玩家对象的瓦片索引
    tileindex = playerObject.gid; //80
    // console.log(player1img); 
    let x = playerObject.x;
    let y = playerObject.y - tileSize;//直接获得是左下角?
    player[levelIndex] = new Player(x, y, speed, hp, tileindex, levelIndex);
    //console.log("存储的玩家对象:", player[levelIndex]);
}

// 获取碰撞层数据
function getColl(){
    let collisionLayer = Level1Data.layers.find(layer => layer.name === "coll");
    //console.log("碰撞层:", collisionLayer);
    coll[levelIndex] = new Coll(collisionLayer.data, levelIndex);
    console.log("碰撞层1:", coll[levelIndex]);
}

// 获取碰撞层water数据
function getWater(){
    let Layer = Level1Data.layers.find(layer => layer.name === "water");
    //console.log("层:", Layer);
    water[levelIndex] = new Water(Layer.data, levelIndex);
    //console.log("水层1:", water[levelIndex]);
}

// 获取碰撞层others数据(不设计碰撞当做背景)
function getOthers(){
    let othersLayer = Level1Data.layers.find(layer => layer.name === "others");
    //console.log("others层:", othersLayer);
    others[levelIndex] = new Others(othersLayer.data, levelIndex);
}

// 获取敌人层数据
function getEnemies(){
    let enemiesLayer = Level1Data.layers.find(layer => layer.name === "enemies");
    console.log("敌人层:", enemiesLayer);
    // 获取每个敌人,创建为单个敌人类的对象,存储到数组enemies[levelIndex]里
    for(let i = 0; i < enemiesLayer.objects.length; i++){
        let x = enemiesLayer.objects[i].x;
        let y = enemiesLayer.objects[i].y - tileSize;
        let imgIndex = enemiesLayer.objects[i].gid;
        let speed = enemiesLayer.objects[i].properties.find(p => p.name === "speed").value;
        let hp = enemiesLayer.objects[i].properties.find(p => p.name === "hp").value;
        let range = enemiesLayer.objects[i].properties.find(p => p.name === "range").value;
        enemies[levelIndex][i] = new OneEnemy(x,y,speed,hp,range,imgIndex,levelIndex);
    }
    console.log("敌人层获得:", enemies[levelIndex]);
}


// 获取陷阱层数据
function getTraps(){
    let trapsLayer = Level1Data.layers.find(layer => layer.name === "trap");
    console.log("陷阱层:", trapsLayer);
    for(let i = 0; i < trapsLayer.objects.length; i++){
        let x = trapsLayer.objects[i].x;
        let y = trapsLayer.objects[i].y - tileSize;
        let imgIndex = trapsLayer.objects[i].gid;
        traps[levelIndex][i] = new OneTrap(x,y,imgIndex,levelIndex);
    }
}

// 获取交互层数据
function getInteract(){
    let Layer = Level1Data.layers.find(layer => layer.name === "interact");
    console.log("交互层:", Layer);
    let diamondNum = 0;
    let boxNum = 0;
    for(let i = 0; i < Layer.objects.length; i++){
        let interType = Layer.objects[i].type;
        if(interType === "diamond"){
            let x = Layer.objects[i].x;
            let y = Layer.objects[i].y - tileSize;
            let imgIndex = Layer.objects[i].gid;
            diamonds[levelIndex][diamondNum++] = new OneDiamond(x,y,imgIndex,levelIndex);
        }
        else if(interType === "box"){
            let x = Layer.objects[i].x;
            let y = Layer.objects[i].y - tileSize;
            let imgIndex = Layer.objects[i].gid;
            boxes[levelIndex][boxNum++] = new OneBox(x,y,imgIndex,levelIndex);
        }
        else if(interType === "flag"){
            let x = Layer.objects[i].x;
            let y = Layer.objects[i].y - tileSize;
            let imgIndex = Layer.objects[i].gid;
            flag[levelIndex] = new OneFlag(x,y,imgIndex,levelIndex);
        }

    }
}



