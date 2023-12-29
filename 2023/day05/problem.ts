export type SantasList<
    T extends ReadonlyArray<unknown>,
    U extends ReadonlyArray<unknown>
> = [...T, ...U];
