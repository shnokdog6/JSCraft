import { ImageLoader } from "three"

export const ImageResources = new class {
    private _imageLoader: ImageLoader;
    private _images: Map<string, HTMLImageElement>;

    constructor() {
        this._imageLoader = new ImageLoader();
        this._images = new Map<string, HTMLImageElement>();
    }

    Get(name: string): HTMLImageElement {
        let image = this._images.get(name);
        if (!image) {
            image = this._imageLoader.load("/images/" + name);
            this._images.set(name, image);
        }
        return image;
    }

    async GetAsync(name: string): Promise<HTMLImageElement> {
        let image = this._images.get(name);
        if (!image) {
            image = await this._imageLoader.loadAsync("/images/" + name);
            this._images.set(name, image);
        }
        return image;
    }
}