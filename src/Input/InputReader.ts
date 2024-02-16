import { EventDispatcher, Vector2 } from "three";

enum InputEvent{
    Move = "move",
    Jump = "jump",
    MouseMove = "mousemove"
}

interface MouseMove{
    type: {position: Vector2}
}

const InputReader = new class {

    private moveLeft: number = 0;
    private moveRight: number = 0;

    public events: EventDispatcher<any>;

    constructor() {
       
        this.events = new EventDispatcher<any>();

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

            this.events.dispatchEvent<any>({
                type: InputEvent.Move,
                direction: this.moveRight - this.moveLeft
            });
    
        }

        if (event.code == "KeyW") {
            this.events.dispatchEvent<any>({
                type: InputEvent.Jump,
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
                type: InputEvent.Move,
                direction: this.moveRight - this.moveLeft
            });
        }

        if (event.code == "KeyW") {
            this.events.dispatchEvent({
                type: InputEvent.Jump,
                state: false
            });
        }
    }
}

export {InputEvent, InputReader};