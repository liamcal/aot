import { DistributiveArrayOfLenght } from "../../utils";

export type BoxToys<
    Item extends string,
    Size extends number
> = DistributiveArrayOfLenght<Size, Item>;
