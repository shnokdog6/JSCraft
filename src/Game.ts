import * as THREE from "three"
import { Player } from "./GameObjects/Player";
import { World } from "./World";
import { Time } from "./Time";
import { GridHelper, OrthographicCamera, Scene, WebGLRenderer } from "three";

export class Game {

    private fructumSize: number;
    private aspect: number;

    private renderer: WebGLRenderer;
    private camera: OrthographicCamera;
    private gridHelper: GridHelper;

    private player: Player;
    private scene: Scene;
    private world: World;

    constructor() {


        this.fructumSize = 16;
        this.aspect = window.innerWidth / window.innerHeight;

        this.initRenderer();
        this.initScene();
        this.initGridHelper();
        this.initCamera();
        this.initCallbacks();

        this.player = new Player();
        this.scene.add(this.player);

        this.world = new World(100, 50);
        this.world.generate();
        this.world.addObject(this.player);

        this.player.position.set(this.world.width / 2, this.world.height + 2, 0);

        Time.Init();
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.autoClear = false;

        document.body.appendChild(this.renderer.domElement);
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x94e1ff);
    }

    initGridHelper() {
        const gridSize = this.fructumSize * 500 + 1;
        this.gridHelper = new THREE.GridHelper(gridSize, gridSize);
        this.gridHelper.rotation.x = Math.PI / 2;

        this.scene.add(this.gridHelper);
    }

    initCamera() {
        this.camera = new THREE.OrthographicCamera(this.fructumSize * this.aspect / -2, this.fructumSize * this.aspect / 2,
            this.fructumSize / 2, this.fructumSize / -2, 0.1, 100);
        this.camera.position.set(0, 0, 1);
    }

    initCallbacks() {
        window.addEventListener("resize", () => this.OnWindowResize());
        window.addEventListener("focus", () => this.OnWindowFocus());
    }

    run() {
        requestAnimationFrame(() => this.run());

        Time.Update();


        this.player.update();
        this.camera.position.set(this.player.position.x, this.player.position.y, this.camera.position.z);


        this.renderer.clearColor();
        this.renderer.render(this.scene, this.camera);
        this.world.render(this.renderer, this.fructumSize, this.aspect, this.camera, this.player);
    }

    OnWindowResize() {
        this.aspect = window.innerWidth / window.innerHeight;

        this.camera.left = this.fructumSize * this.aspect / -2;
        this.camera.right = this.fructumSize * this.aspect / 2;
        this.camera.top = this.fructumSize / 2;
        this.camera.bottom = this.fructumSize / -2;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }



    OnWindowFocus() {

        console.log("focus");
    }
}