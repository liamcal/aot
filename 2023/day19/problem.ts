import { ArrayOfLength } from "../../utils";

type NextToy = {
    "🛹": "🚲";
    "🚲": "🛴";
    "🛴": "🏄";
    "🏄": "🛹";
};

export type Rebuild<
    T,
    Toy extends keyof NextToy = "🛹",
    Acc extends unknown[] = []
> = T extends [infer Head extends number, ...infer Rest extends number[]]
    ? Rebuild<Rest, NextToy[Toy], [...Acc, ...ArrayOfLength<Head, Toy>]>
    : Acc;
