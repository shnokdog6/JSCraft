import { WebGLRenderer } from "three";

export interface IRenderable {
    render(renderer: WebGLRenderer): void;
}

export function isRenderable(obj: any): obj is IRenderable{
    return "render" in obj;
}
