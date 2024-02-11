import { TextureResources } from "./TextureResources";
import { MeshBasicMaterial } from "three";

export const MaterialResources = new class {
    private _materials: Map<string, MeshBasicMaterial>;

    constructor(){
        this._materials = new Map<string, MeshBasicMaterial>();
    }

    Get(name: string): MeshBasicMaterial {
        let material = this._materials.get(name);
        if (!material) {
            material = new MeshBasicMaterial({ map: TextureResources.Get(name), transparent: true });
            this._materials.set(name, material);
        }
        return material;
    }
}