import { DoubleSide, MeshBasicMaterial, PlaneGeometry } from "three";
import { GameObject } from "./GameObject";
import { Collider } from "../Components/Collider";
import { Rigidbody } from "../Components/Rigidbody";
import { Constants } from "../Constants";
import { Time } from "../Time";
import { PlayerAnimation } from "../Components/Player/PlayerAnimation";
import { InputReader, InputEvent } from "../Input/InputReader";


export class Player extends GameObject {

    public movementSpeed: number = 10;
    public isJumping: boolean = false;
    public direction: number = 0;

    public collider: Collider;
    public rigidbody: Rigidbody;
    public playerAnimation: PlayerAnimation;

    constructor() {

        const geometry = new PlaneGeometry(1.5, 2);
        const material = new MeshBasicMaterial({ transparent: true, side: DoubleSide });

        super(geometry, material);

        this.collider = this.addComponent(Collider) as Collider;
        this.rigidbody = this.addComponent(Rigidbody, this.collider, 4) as Rigidbody;
        this.playerAnimation = this.addComponent(PlayerAnimation) as PlayerAnimation;

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
            this.rigidbody.velocity.y = -75 * Constants.gravity * Time.deltaTime ** 2;
            this.rigidbody.onGround = false;
        }

    }

    rotateToMoveDirection() {
        if (this.direction != 0)
            this.rotation.y = this.direction > 0 ? Math.PI : 0;
    }


    onMove(event) {
        this.direction = event.direction;
        this.rotateToMoveDirection();
    }

    onJump(event) {
        this.isJumping = event.state;
    }

    onCollision(event) {
        //console.log(event.direction);
    }

}