import * as THREE from "three"
import { PlayerObject } from "./GameObjects/PlayerObject";
import { World } from "./World";
import { WebGLRenderer } from "three";
import { UpdateStack } from "./Stacks/UpdateStack";
import { RenderStack } from "./Stacks/RenderStack";
import { Camera } from "./Tools/Camera";
import { InitStack } from "./Stacks/InitStack";
import {Mesh} from "./Components/Mesh";

export class Game {

    private renderer: WebGLRenderer;

    async init(): Promise<void> {
        this.initRenderer();
        this.initCallbacks();

        const world: World = new World(1000, 50);
        await world.generate();

        RenderStack.subscribe(world);

        const playerObject: PlayerObject = new PlayerObject();
        world.addObject(playerObject);
        world.setRelativeObject(playerObject.getComponent(Mesh));

        Camera.setFollowToObject(playerObject.transform);
        playerObject.transform.position.set(world.width / 2, 55, 0);

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