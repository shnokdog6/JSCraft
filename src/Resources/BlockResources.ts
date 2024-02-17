import { FileLoader } from "three";
import { Block } from "../GameObjects/Block";

export const BlockResources = new class {
    private _blocks: Map<string, Block>;
    private _fileLoader: FileLoader;

    constructor() {
        this._blocks = new Map<string, Block>();
        this._fileLoader = new FileLoader();
    }

    Get(name: string): Block {

        let block = this._blocks.get(name);
        if (!block) {
            this._fileLoader.load("blocks/dirt.json", (file) => {
                const data = JSON.parse(file.toString());
                block = new Block(data.blockId, data.texture);

                this._blocks.set(name, block);
            });
        }
        return block;
    };

    async GetAsync(name: string): Promise<Block> {

        let block = this._blocks.get(name);
        if (!block) {
            const file = await this._fileLoader.loadAsync(`blocks/${name}.json`);
            const data = JSON.parse(file.toString());

            block = await Block.createBlock(data.blockId, data.texture);
            this._blocks.set(name, block);
        }
        return Block.clone(block);
    };

}
