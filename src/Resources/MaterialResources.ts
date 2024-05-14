import { TextureResources } from "./TextureResources";
import { MeshBasicMaterial } from "three";

export const MaterialResources = new (class {
    private _materials: Map<string, MeshBasicMaterial>;

    constructor() {
        this._materials = new Map<string, MeshBasicMaterial>();
    }

    async GetAsync(name: string): Promise<MeshBasicMaterial> {
        let material = this._materials.get(name);
        if (!material) {
            const texture = await TextureResources.GetAsync(name);
            material = new MeshBasicMaterial({
                map: texture,
                transparent: true,
            });
            this._materials.set(name, material);
        }

        return material;
    }

    Get(name: string): MeshBasicMaterial {
        let material = this._materials.get(name);
        if (!material) {
            material = new MeshBasicMaterial({
                map: TextureResources.Get(name),
                transparent: true,
            });
            this._materials.set(name, material);
        }

        return material;
    }
})();
