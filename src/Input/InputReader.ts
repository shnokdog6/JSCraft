import {EventDispatcher} from "three";

interface InputEvent {
    Move: { direction: number };
    Jump: { state: boolean }
}

export type MoveEvent = InputEvent["Move"];
export type JumpEvent = InputEvent["Jump"];

export const InputReader = new class {

    private moveLeft: number = 0;
    private moveRight: number = 0;

    public events: EventDispatcher<InputEvent>;

    constructor() {

        this.events = new EventDispatcher<InputEvent>();

        window.addEventListener("keyup", (event) => this.OnKeyUp(event));
        window.addEventListener("keydown", (event) => this.OnKeyDown(event));
    }

    private OnKeyDown(event: KeyboardEvent): void {

        if (event.repeat) return;

        if (event.code == "KeyA" || event.code == "KeyD") {

            if (event.code == "KeyA") {
                this.moveLeft = 1;
            }

            if (event.code == "KeyD") {
                this.moveRight = 1;
            }

            this.events.dispatchEvent({
                type: "Move",
                direction: this.moveRight - this.moveLeft
            });

        }

        if (event.code == "KeyW") {
            this.events.dispatchEvent({
                type: "Jump",
                state: true
            });
        }


    }

    private OnKeyUp(event: KeyboardEvent): void {
        if (event.code == "KeyA" || event.code == "KeyD") {

            if (event.code == "KeyA") {
                this.moveLeft = 0;
            }

            if (event.code == "KeyD") {
                this.moveRight = 0;
            }

            this.events.dispatchEvent({
                type: "Move",
                direction: this.moveRight - this.moveLeft
            });
        }

        if (event.code == "KeyW") {
            this.events.dispatchEvent({
                type: "Jump",
                state: false
            });
        }
    }
}