export interface IInitializable {
    init(): void;
}

export function isInitializable(obj: any): obj is IInitializable{
    return "init" in obj;
}
