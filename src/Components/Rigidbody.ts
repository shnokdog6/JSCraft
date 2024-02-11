import { EventDispatcher, Vector2 } from "three";
import { Component } from "./Component";
import { Collider } from "./Collider";
import { Constants } from "../Constants";
import { Time } from "../Time";
import { GameObject } from "../GameObjects/GameObject";

export class Rigidbody extends Component {

    static moveX_Event: string = "moveX";
    static moveY_Event: string = "moveY";

    public collider: Collider;
    public velocity: Vector2;
    public weight: number;
    public onGround: boolean;
    public events: EventDispatcher<any>;

    constructor(gameObject: GameObject, collider: Collider, weight: number) {
        super(gameObject);

        this.collider = collider;
        this.velocity = new Vector2(0, 0);
        this.weight = weight;
        this.onGround = false;
        this.events = new EventDispatcher<any>();

        collider.events.addEventListener(Collider.collisionEvent, (event) => this.onCollision(event));
    }

    public update(): void {
        this.calculateGravity();
        this.applyVelocty();
    }

    private calculateGravity(): void {
        if (!this.onGround) {
            this.velocity.y += this.weight * Constants.gravity * Time.deltaTime ** 2;
        }
        this.onGround = false;
    }

    private applyVelocty(): void {
        this.gameObject.position.x += this.velocity.x;
        this.events.dispatchEvent({ type: Rigidbody.moveX_Event });

        this.gameObject.position.y += this.velocity.y;
        this.events.dispatchEvent({ type: Rigidbody.moveY_Event });
    }

    private onCollision(event): void {

        const collision = event.collision;
        switch (collision.direction) {
            case "left":
            case "right":
                this.velocity.x = 0;
                break;
            case "down":
                this.onGround = true;
                this.velocity.y = 0;
            case "up":
                this.velocity.y = 0;
        }
    }

}