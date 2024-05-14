import { Material, MeshBasicMaterial, PlaneGeometry } from "three";
import { MaterialResources } from "../Resources/MaterialResources";
import { GameObject } from "./GameObject";
import { Mesh, MeshOptions } from "../Components/Mesh";
import { Collider } from "../Components/Collider";

export class Block extends GameObject {
    static geometry: PlaneGeometry = new PlaneGeometry(1, 1);

    public blockId: number;
    public collider: Collider;
    public mesh: Mesh;

    constructor(id: number, material: MeshBasicMaterial) {
        super();

        this.blockId = id;
        this.collider = this.addComponent(Collider) as Collider;
        this.mesh = this.addComponent(
            Mesh,
            (): MeshOptions => ({
                geometry: Block.geometry,
                material,
                subscribeToRenderStack: false,
            }),
        ) as Mesh;
    }

    static async createBlock(id: number, materialName: string): Promise<Block> {
        const material = await MaterialResources.GetAsync(materialName);
        return new Block(id, material);
    }

    static clone(source: Block): Block {
        return new Block(
            source.blockId,
            source.mesh.material as MeshBasicMaterial,
        );
    }
}
