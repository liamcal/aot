// type RemoveNaughtyChildren<T> = { [Key in keyof T as Key extends `naughty${infer X}` ? never : Key]: T[Key]};
export type RemoveNaughtyChildren<T> = Omit<T, `naughty${string}`>;
