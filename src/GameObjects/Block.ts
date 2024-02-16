import { Material, MeshBasicMaterial, PlaneGeometry } from "three";
import { MaterialResources } from "../Resources/MaterialResources";
import { GameObject } from "./GameObject";

export class Block extends GameObject {

    static geometry: PlaneGeometry = new PlaneGeometry(1, 1);

    public blockId: number;

    constructor(id: number, material: MeshBasicMaterial) {
        super(Block.geometry, material)
        this.blockId = id;
    }

    static async createBlock(id: number, materialName: string): Promise<Block> {
        const material = await MaterialResources.GetAsync(materialName);
        return new Block(id, material);
    }
}