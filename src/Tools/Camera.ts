import { OrthographicCamera, Vector3 } from "three";
import { GameObject } from "../GameObjects/GameObject";
import { IUpdatable } from "../Interfaces/IUpdatable";
import { UpdateStack } from "../Stacks/UpdateStack";
import { Transform } from "../Components/Transform";

const DEFAULT_FRUCTUM = 10;

export const Camera = new (class
    extends OrthographicCamera
    implements IUpdatable
{
    private _fructumSize: number;
    private _aspect: number;
    private _followObject: Transform;

    get fructumSize() {
        return this._fructumSize;
    }

    get aspect() {
        return this._aspect;
    }

    constructor(fructumSize = DEFAULT_FRUCTUM) {
        const aspect = window.innerWidth / window.innerHeight;
        super(
            (fructumSize * aspect) / -2,
            (fructumSize * aspect) / 2,
            fructumSize / 2,
            fructumSize / -2,
            0.1,
            100,
        );

        this._fructumSize = fructumSize;
        this._aspect = aspect;

        this.position.set(0, 0, 1);

        window.addEventListener("resize", () => this.onWindowResize());
    }

    public update(): void {
        if (this._followObject) {
            this.position.set(
                this._followObject.position.x,
                this._followObject.position.y,
                1,
            );
        }
    }

    public setFollowToObject(object: Transform): void {
        this._followObject = object;
        UpdateStack.subscribe(this);
    }

    public TransformToWorldCoordinate(vector: Vector3): Vector3 {
        const newVector: Vector3 = new Vector3(
            (vector.x / window.innerWidth) * 2 - 1,
            -(vector.y / window.innerHeight) * 2 + 1,
            0.5,
        );
        return newVector.unproject(this);
    }

    onWindowResize() {
        this._aspect = window.innerWidth / window.innerHeight;

        this.left = (this.fructumSize * this.aspect) / -2;
        this.right = (this.fructumSize * this.aspect) / 2;
        this.top = this.fructumSize / 2;
        this.bottom = this.fructumSize / -2;
        this.updateProjectionMatrix();
    }
})();
