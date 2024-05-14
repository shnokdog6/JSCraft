import { EventDispatcher, Vector2 } from "three";
import { Component } from "./Component";
import { Collider, CollisionEvent, Direction } from "./Collider";
import { Constants } from "../Constants/Constants";
import { Time } from "../Tools/Timer";
import { GameObject } from "../GameObjects/GameObject";
import { IUpdatable } from "../Interfaces/IUpdatable";

export interface RigidbodyOptions {
    collider: Collider;
    weight: number;
}

export class Rigidbody extends Component implements IUpdatable {
    static moveX_Event: string = "moveX";
    static moveY_Event: string = "moveY";

    public collider: Collider;
    public velocity: Vector2;
    public weight: number;
    public onGround: boolean;
    public events: EventDispatcher<any>;

    constructor(gameObject: GameObject, options: () => RigidbodyOptions) {
        super(gameObject);

        const { collider, weight } = options();

        this.collider = collider;
        this.velocity = new Vector2(0, 0);
        this.weight = weight;
        this.onGround = false;
        this.events = new EventDispatcher<any>();

        collider.events.addEventListener("Collision", (event) =>
            this.onCollision(event),
        );
    }

    public update(): void {
        this.calculateGravity();
        this.applyVelocty();
    }

    private calculateGravity(): void {
        if (!this.onGround) {
            this.velocity.y +=
                this.weight * Constants.gravity * Time.deltaTime ** 2;
        }
        this.onGround = false;
    }

    private applyVelocty(): void {
        this.transform.position.x += this.velocity.x;
        this.events.dispatchEvent({ type: Rigidbody.moveX_Event });

        this.transform.position.y += this.velocity.y;
        this.events.dispatchEvent({ type: Rigidbody.moveY_Event });
    }

    private onCollision(event: CollisionEvent): void {
        const collision = event.collision;
        switch (collision.direction) {
            case Direction.LEFT:
            case Direction.RIGHT:
                this.velocity.x = 0;
                break;
            case Direction.DOWN:
                this.onGround = true;
                this.velocity.y = 0;
            case Direction.UP:
                this.velocity.y = 0;
        }
    }
}
