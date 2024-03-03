import { GameObject } from "./GameObject";
import { Crosshair } from "./UI/Crosshair";
import {Player} from "../Components/Player/Player";



export class PlayerObject extends GameObject {

    public readonly playerComponent: Player;
    private _crosshair: Crosshair;



    constructor() {
        super();

        this.playerComponent = this.addComponent(Player);
        this._crosshair = new Crosshair();
    }

}