export type ToNumber<N> = N extends `${infer Number extends number}`
    ? Number
    : never;

export type Find<
    Arr extends unknown[],
    Item,
    Acc extends unknown[] = []
> = Arr extends [infer Head, ...infer Tail]
    ? Head extends Item
        ? Acc["length"]
        : Find<Tail, Item, [...Acc, Head]>
    : never;

export type FindInMatrix<
    Mat extends unknown[][],
    Item,
    Acc extends unknown[][] = []
> = Mat extends [
    infer Head extends unknown[],
    ...infer Tail extends unknown[][]
]
    ? Find<Head, Item> extends never
        ? FindInMatrix<Tail, Item, [...Acc, Head]>
        : [Acc["length"], Find<Head, Item>]
    : never;

export type Count<
    Arr extends unknown[],
    Item,
    Acc extends unknown[] = []
> = Arr extends [infer Head, ...infer Rest]
    ? Head extends Item
        ? Count<Rest, Item, [...Acc, Item]>
        : Count<Rest, Item, Acc>
    : Acc["length"];

export type ArrayOfLength<
    Length extends number,
    Item = never,
    Acc extends unknown[] = []
> = Acc["length"] extends Length
    ? Acc
    : ArrayOfLength<Length, Item, [...Acc, Item]>;

export type DistributiveArrayOfLenght<
    Length extends number,
    Item = never,
    Acc extends unknown[] = []
> = Length extends Acc["length"]
    ? Acc
    : ArrayOfLength<Length, Item, [...Acc, Item]>;

export type Add<A extends number, B extends number> = [
    ...ArrayOfLength<A>,
    ...ArrayOfLength<B>
]["length"] &
    number;

export type Pop<T extends unknown[]> = T extends [...infer Head, any]
    ? Head
    : T;

export type Flatten<
    T extends unknown[][],
    Acc extends unknown[] = []
> = T extends [infer Head extends unknown[], ...infer Rest extends unknown[][]]
    ? Flatten<Rest, [...Acc, ...Head]>
    : Acc;

export type ExtendArr<Arr extends unknown[]> = Arr extends Array<infer T>
    ? [...Arr, T]
    : never;

export type PlaceItemInArray<
    Arr extends unknown[],
    Item,
    Idx extends number,
    Acc extends unknown[] = []
> = Acc["length"] extends Arr["length"]
    ? Acc
    : Acc["length"] extends Idx
    ? PlaceItemInArray<Arr, Item, Idx, [...Acc, Item]>
    : PlaceItemInArray<Arr, Item, Idx, [...Acc, Arr[Acc["length"]]]>;

export type PlaceItemInMatrix<
    Mat extends unknown[][],
    Item,
    Row extends number,
    Col extends number,
    Acc extends unknown[][] = []
> = Acc["length"] extends Mat["length"]
    ? Acc
    : Acc["length"] extends Row
    ? PlaceItemInMatrix<
          Mat,
          Item,
          Row,
          Col,
          [...Acc, PlaceItemInArray<Mat[Acc["length"]], Item, Col>]
      >
    : PlaceItemInMatrix<Mat, Item, Row, Col, [...Acc, Mat[Acc["length"]]]>;

export type ReplaceInArray<
    Arr extends unknown[],
    S,
    R,
    Acc extends unknown[] = []
> = Arr extends [infer Head, ...infer Tail]
    ? ReplaceInArray<Tail, S, R, [...Acc, Head extends S ? R : Head]>
    : Acc;

export type ReplaceInMatrix<
    Arr extends unknown[][],
    S,
    R,
    Acc extends unknown[][] = []
> = Arr extends [
    infer Head extends unknown[],
    ...infer Tail extends unknown[][]
]
    ? ReplaceInMatrix<Tail, S, R, [...Acc, ReplaceInArray<Head, S, R>]>
    : Acc;

export type Increment<N extends number> = [
    ...ArrayOfLength<N>,
    unknown
]["length"] &
    number;

export type Decrement<N extends number> = ArrayOfLength<N> extends [
    infer Head,
    ...infer Tail
]
    ? Tail["length"] & number
    : unknown;
