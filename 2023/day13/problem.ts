import { Add, ArrayOfLength } from "../../utils";

export type DayCounter<
    Start extends number,
    End extends number
> = Start extends End ? End : Start | DayCounter<Add<Start, 1>, End>;

// export type DayCounter<
//     Start extends number,
//     End extends number,
//     Acc extends unknown[] = ArrayOfSize<Start>
// > = Acc["length"] extends End
//     ? Start
//     : Start | DayCounter<[...Acc, never]["length"], End, [...Acc, never]>;
