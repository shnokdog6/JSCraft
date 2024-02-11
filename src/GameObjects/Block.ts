import { MeshBasicMaterial, PlaneGeometry } from "three";
import { MaterialResources } from "../Resources/MaterialResources";
import { GameObject } from "./GameObject";

export class Block extends GameObject {

    static geometry: PlaneGeometry = new PlaneGeometry(1, 1);

    public blockId: number;

    constructor(id : number, materialName: string) {
        super(Block.geometry, MaterialResources.Get(materialName))
        this.blockId = id;
    }
}