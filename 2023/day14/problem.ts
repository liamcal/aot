export type DecipherNaughtyList<T> = T extends `${infer Head}/${infer Tail}`
    ? Head | DecipherNaughtyList<Tail>
    : T;
