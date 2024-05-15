import "reflect-metadata";

export interface ComponentOption {
    require?: object[];
}

export function Component(options?: ComponentOption) {
    return function(contructor: Function) {
        Reflect.metadata(Component, options);
    }

}