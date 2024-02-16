export interface IUpdatable {
    update(): void;
}

export function isUpdatable(obj: any): obj is IUpdatable {
    return "update" in obj;
}
