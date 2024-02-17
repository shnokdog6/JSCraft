import * as THREE from "three"
import { Player } from "./GameObjects/Player";
import { World } from "./World";
import { Time } from "./Tools/Timer";
import { WebGLRenderer } from "three";
import { UpdateStack } from "./Stacks/UpdateStack";
import { RenderStack } from "./Stacks/RenderStack";
import { Camera } from "./Tools/Camera";
import { InitStack } from "./Stacks/InitStack";

export class Game {

    private renderer: WebGLRenderer;

    private player: Player;
    private world: World;

    constructor() {

    }

    async init(): Promise<void> {
        this.initRenderer();
        this.initCallbacks();

        this.world = new World(1000, 50);
        await this.world.generate();

        RenderStack.subscribe(this.world);

        this.player = new Player();
        this.world.addObject(this.player);
        this.world.setRelativeObject(this.player.mesh);

        Camera.setFollowToObject(this.player.transform);
        this.player.transform.position.set(this.world.width / 2, 55, 0);

        InitStack.init();

    }


    initRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.autoClear = false;
        this.renderer.setClearColor(new THREE.Color(0x94e1ff));

        document.body.appendChild(this.renderer.domElement);
    }

    initCallbacks() {
        window.addEventListener("resize", () => this.onWindowResize());
    }


    run() {
        requestAnimationFrame(() => this.run());

        UpdateStack.update();

        this.renderer.clearColor();
        RenderStack.render(this.renderer);
    }

    onWindowResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }


}