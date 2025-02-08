import * as THREE from 'three';
import * as spine from "@esotericsoftware/spine-threejs";
// import WebGL from 'three/addons/capabilities/WebGL.js';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// camera.position.z = 5;

// function animate() {
// 	renderer.render( scene, camera );
//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;
// }
// renderer.setAnimationLoop( animate );


let scene, camera, renderer;
let geometry, material, mesh, skeletonMesh;
let atlas;
let atlasLoader;
let assetManager;
let canvas;
// let controls;
let lastFrameTime = Date.now() / 1000;

let baseUrl = "spine/";
let skeletonFile = "capoo_basic_002.json";
let atlasFile = "capoo_basic_002.atlas";
let animation = "run";

let atlas1;
let assetManager1;
let atlasLoader1;
let skeletonMesh1;
let skeletonFile1 = "capoo_basic_face_001.json";
let atlasFile1 = "capoo_basic_face_001.atlas";
let animation1 = "basic";

let atlas2;
let atlasLoader2;
let skeletonMesh2;
let skeletonFile2 = "capoo_hat_102.json";
let atlasFile2 = "capoo_hat_102.atlas";
let animation2 = "animation";

let atlas3;
let atlasLoader3;
let skeletonMesh3;
let skeletonFile3 = "capoo_back_102.json";
let atlasFile3 = "capoo_back_102.atlas";
let animation3 = "animation";

function init() {
    // create the THREE.JS camera, scene and renderer (WebGL)
    let width = window.innerWidth,
    height = window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, width / height, 1, 3000);
    camera.position.y = 0;
    camera.position.z = 400;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    document.body.appendChild(renderer.domElement);
    canvas = renderer.domElement;
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";

    // controls = new OrbitControls(camera, renderer.domElement);

    // load the assets required to display the Raptor model
    assetManager = new spine.AssetManager(baseUrl);
    assetManager.loadText(skeletonFile);
    assetManager.loadTextureAtlas(atlasFile);

    assetManager1 = new spine.AssetManager(baseUrl);
    assetManager1.loadText(skeletonFile1);
    assetManager1.loadTextureAtlas(atlasFile1);

    console.log("initialized");
    requestAnimationFrame(load);
}

function load(name, scale) {
    console.log("loading");
    if (assetManager.isLoadingComplete() && assetManager1.isLoadingComplete()) {
    console.log(assetManager.isLoadingComplete());
    // Add a box to the scene to which we attach the skeleton mesh
    // geometry = new THREE.BoxGeometry(200, 200, 200);
    // material = new THREE.MeshBasicMaterial({
    //     color: 0x00ff00,
    //     wireframe: true,
    // });
    // mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);

    // Load the texture atlas using name.atlas and name.png from the AssetManager.
    // The function passed to TextureAtlas is used to resolve relative paths.
    atlas = assetManager.require(atlasFile);

    // Create a AtlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
    atlasLoader = new spine.AtlasAttachmentLoader(atlas);

    // Create a SkeletonJson instance for parsing the .json file.
    let skeletonJson = new spine.SkeletonJson(atlasLoader);

    // Set the scale to apply during parsing, parse the file, and create a new skeleton.
    skeletonJson.scale = 0.4;
    let skeletonData = skeletonJson.readSkeletonData(
        assetManager.require(skeletonFile)
    );

    // Create a SkeletonMesh from the data and attach it to the scene
    skeletonMesh = new spine.SkeletonMesh({ skeletonData });
    skeletonMesh.state.setAnimation(0, animation, true);
    // mesh.add(skeletonMesh);
    scene.add(skeletonMesh);


    // add face
    atlas1 = assetManager1.require(atlasFile1);
    atlasLoader1 = new spine.AtlasAttachmentLoader(atlas1);
    let skeletonJson1 = new spine.SkeletonJson(atlasLoader1);
    skeletonJson1.scale = 0.4;
    let skeletonData1 = skeletonJson1.readSkeletonData(
        assetManager1.require(skeletonFile1)
    );
    skeletonMesh1 = new spine.SkeletonMesh({ skeletonData: skeletonData1 });
    skeletonMesh1.state.setAnimation(0, animation1, true);
    skeletonMesh.add(skeletonMesh1);
    skeletonMesh1.position.set(-30, 50
        , 5);

    requestAnimationFrame(render);
    } else requestAnimationFrame(load);
}

let lastTime = Date.now();
function render() {
    // calculate delta time for animation purposes
    let now = Date.now() / 1000;
    let delta = now - lastFrameTime;
    lastFrameTime = now;

    // resize canvas to use full page, adjust camera/renderer
    resize();

    // Update orbital controls
    // mesh.rotation.x = Math. sin(now) * Math. PI * 0.2;
    // mesh.rotation.y = Math. cos(now) * Math. PI * 0.4;

    // update the animation
    skeletonMesh.update(delta);
    skeletonMesh1.update(delta);

    // render the scene
    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

function resize() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    if (canvas.width != w || canvas.height != h) {
    canvas.width = w;
    canvas.height = h;
    }

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
}

init();
