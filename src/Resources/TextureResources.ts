import {NearestFilter, SRGBColorSpace, Texture, TextureLoader} from "three";

export const TextureResources = new class {
    
    private _textureLoader: TextureLoader;
    private _textures: Map<string, Texture>;

    constructor(){
        this._textureLoader = new TextureLoader();
        this._textures = new Map<string, Texture>();
    }

    Get(name: string): Texture {
        let texture = this._textures.get(name);
        if (!texture) {
            texture = this._textureLoader.load("/images/" + name);
            texture.colorSpace = SRGBColorSpace;
            texture.magFilter = NearestFilter;

            this._textures.set(name, texture);
        }
        return texture;
    }

    async GetAsync(name: string): Promise<Texture> {
        let texture = this._textures.get(name);
        if (!texture) {
            texture = await this._textureLoader.loadAsync("/images/" + name);
            texture.colorSpace = SRGBColorSpace;
            texture.magFilter = NearestFilter;

            this._textures.set(name, texture);
        }
        return texture;
    }

}