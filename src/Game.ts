import * as THREE from "three"
import { Player } from "./GameObjects/Player";
import { World } from "./World";
import { Time } from "./Tools/Time";
import { WebGLRenderer } from "three";
import { UpdateStack } from "./Stacks/UpdateStack";
import { RenderStack } from "./Stacks/RenderStack";
import { Camera } from "./Tools/Camera";

export class Game {

    private renderer: WebGLRenderer;

    private player: Player;
    private world: World;

    constructor() {
        this.initRenderer();
        this.initCallbacks();

        this.world = new World(100, 50);
        this.world.generate();

        RenderStack.subscribe(this.world);

        this.player = new Player();
        this.world.addObject(this.player);
        this.world.setRelativeObject(this.player);


        Camera.setFollowToObject(this.player);
        this.player.position.set(this.world.width / 2, this.world.height + 2, 0);


        Time.init();
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

        //this.world.render(this.renderer, this.player);
        //this.renderer.render(this.player, Camera);
        //this.renderer.render(this.crosshair, Camera);
    }

    onWindowResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }


}