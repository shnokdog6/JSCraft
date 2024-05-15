import { Component } from "../../Decorators/Component";
import { GameObject } from "../../GameObjects/GameObject";
import { Collider, ColliderOptions, Collision } from "../Collider";
import { DoubleSide, MeshBasicMaterial, PlaneGeometry, Vector3 } from "three";
import { Rigidbody, RigidbodyOptions } from "../Rigidbody";
import { Mesh, MeshOptions } from "../Mesh";
import { Time } from "../../Tools/Timer";
import { Constants } from "../../Constants/Constants";
import { PlayerAnimation } from "./PlayerAnimation";
import { InputReader, JumpEvent, MoveEvent } from "../../Input/InputReader";

@Component({
    require: [{}]
})
export class Player {
    public movementSpeed: number = 10;
    public jumpForce: number = 80;
    public isJumping: boolean = false;
    public direction: number = 0;

    private _collider: Collider;
    private _rigidbody: Rigidbody;
    private _mesh: Mesh;
    private _playerAnimation: PlayerAnimation;

    get collider(): Collider {
        return this._collider;
    }

    get rigidbody(): Rigidbody {
        return this._rigidbody;
    }

    get mesh(): Mesh {
        return this._mesh;
    }

    get playerAnimation(): PlayerAnimation {
        return this._playerAnimation;
    }

    constructor(gameObject: GameObject) {
        super(gameObject);

        this._collider = this.gameObject.addComponent(Collider, () => {
            return { size: new Vector3(1.5, 2, 0) };
        });
        this._rigidbody = this.gameObject.addComponent(Rigidbody, () => {
            return { collider: this.collider, weight: 4 };
        });
        this._mesh = this.gameObject.addComponent(Mesh, () => {
            return {
                geometry: new PlaneGeometry(1.5, 2),
                material: new MeshBasicMaterial({
                    transparent: true,
                    side: DoubleSide,
                }),
            };
        });
        this._playerAnimation = this.gameObject.addComponent(PlayerAnimation);
    }

    private getColliderOptions(): ColliderOptions {
        return { size: new Vector3(1.5, 2, 0) };
    }

    private getRigidbodyOptions(): RigidbodyOptions {
        return { collider: this.collider, weight: 4 };
    }

    private getMeshOptions(): MeshOptions {
        return {
            geometry: new PlaneGeometry(1.5, 2),
            material: new MeshBasicMaterial({
                transparent: true,
                side: DoubleSide,
            }),
        };
    }

    public init() {
        this.collider.events.addEventListener(
            "Collision",
            this.onCollision.bind(this),
        );
        InputReader.events.addEventListener("Move", (event) =>
            this.onMove(event),
        );
        InputReader.events.addEventListener("Jump", this.onJump.bind(this));
    }

    public update() {
        this.tryJump();
        this.calculateVelocity();
    }

    private calculateVelocity() {
        this.rigidbody.velocity.x =
            this.direction * this.movementSpeed * Time.deltaTime;
    }

    private tryJump() {
        if (this.isJumping && this.rigidbody.onGround) {
            this.rigidbody.velocity.y =
                -this.jumpForce * Constants.gravity * Time.deltaTime ** 2;
            this.rigidbody.onGround = false;
        }
    }

    private rotateToMoveDirection() {
        if (this.direction != 0)
            this.transform.rotation.y = this.direction > 0 ? Math.PI : 0;
    }

    private onMove(event: MoveEvent) {
        this.direction = event.direction;
        this.rotateToMoveDirection();
    }

    private onJump(event: JumpEvent) {
        this.isJumping = event.state;
    }

    private onCollision(event: Collision) {
        //console.log(event.collision);
    }
}
