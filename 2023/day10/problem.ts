export type StreetSuffixTester<
    T extends string,
    U extends string
> = T extends `${string}${U}` ? true : false;
