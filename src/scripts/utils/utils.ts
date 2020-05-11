export type Constructor<T> = { new(): T };
export type ValueOf<T> = T[keyof T];

export function querySelector<T extends Element>(selector: string, type: Constructor<T>): T {
    const element = document.querySelector(selector);

    if (element == null) throw new Error(`Element "${selector}" is not found`);
    if (!(element instanceof type)) throw new TypeError(`Element "${selector}" is not ${type.name}`);

    return element;
}
