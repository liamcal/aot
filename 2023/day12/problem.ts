import { Find, ToNumber } from "../../utils";

// export type FindSanta<Arr extends string[]> = {
//     [K in keyof Arr]: Arr[K] extends `🎅🏼` ? ToNumber<K> : never;
// }[number];

export type FindSanta<Arr extends string[]> = Find<Arr, "🎅🏼">;
