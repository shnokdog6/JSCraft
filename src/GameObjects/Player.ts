import { DoubleSide, MeshBasicMaterial, PlaneGeometry, Vector3, WebGLRenderer } from "three";
import { GameObject } from "./GameObject";
import { Collider, ColliderOptions } from "../Components/Collider";
import { Rigidbody, RigidbodyOptions } from "../Components/Rigidbody";
import { Constants } from "../Constants/Constants";
import { PlayerAnimation } from "../Components/Player/PlayerAnimation";
import { InputReader, InputEvent } from "../Input/InputReader";
import { IUpdatable } from "../Interfaces/IUpdatable";
import { Crosshair } from "./UI/Crosshair";
import { IRenderable } from "../Interfaces/IRenderable";
import { Camera } from "../Tools/Camera";
import { Time } from "../Tools/Timer";
import { Mesh, MeshOptions } from "../Components/Mesh";



export class Player extends GameObject implements IUpdatable {

    public movementSpeed: number = 10;
    public jumpForce: number = 80;
    public isJumping: boolean = false;
    public direction: number = 0;

    public collider: Collider;
    public rigidbody: Rigidbody;
    public playerAnimation: PlayerAnimation;
    public mesh: Mesh;

    private crosshair: Crosshair;

    constructor() {
        super();

        this.collider = this.addComponent(Collider, (): ColliderOptions => ({ size: new Vector3(1.5, 2, 0) })) as Collider;
        this.rigidbody = this.addComponent(Rigidbody, (): RigidbodyOptions => ({ collider: this.collider, weight: 4 })) as Rigidbody;
        this.mesh = this.addComponent(Mesh, (): MeshOptions => ({
            geometry: new PlaneGeometry(1.5, 2),
            material: new MeshBasicMaterial({ transparent: true, side: DoubleSide })
        })) as Mesh;
        this.playerAnimation = this.addComponent(PlayerAnimation) as PlayerAnimation;
        this.crosshair = new Crosshair(this);


        this.collider.events.addEventListener(Collider.collisionEvent, (event) => this.onCollision(event));

        InputReader.events.addEventListener(InputEvent.Move, (event) => this.onMove(event));
        InputReader.events.addEventListener(InputEvent.Jump, (event) => this.onJump(event));

    }

    update() {
        super.update();
        this.tryJump();
        this.calculateVelocty();
    }

    calculateVelocty() {
        this.rigidbody.velocity.x = this.direction * this.movementSpeed * Time.deltaTime;
    }

    tryJump() {
        if (this.isJumping && this.rigidbody.onGround) {
            this.rigidbody.velocity.y = -this.jumpForce * Constants.gravity * Time.deltaTime ** 2;
            this.rigidbody.onGround = false;
        }

    }

    rotateToMoveDirection() {
        if (this.direction != 0)
            this.transform.rotation.y = this.direction > 0 ? Math.PI : 0;
    }


    onMove(event) {
        this.direction = event.direction;
        this.rotateToMoveDirection();
    }

    onJump(event) {
        this.isJumping = event.state;
    }

    onCollision(event) {
        //console.log(event.collision);
    }

}