import { Add, Flatten } from "../../utils";

/** because "dashing" implies speed */
type Dasher = "💨";

/** representing dancing or grace */
type Dancer = "💃";

/** a deer, prancing */
type Prancer = "🦌";

/** a star for the dazzling, slightly mischievous Vixen */
type Vixen = "🌟";

/** for the celestial body that shares its name */
type Comet = "☄️";

/** symbolizing love, as Cupid is the god of love */
type Cupid = "❤️";

/** representing thunder, as "Donner" means thunder in German */
type Donner = "🌩️";

/** meaning lightning in German, hence the lightning bolt */
type Blitzen = "⚡";

/** for his famous red nose */
type Rudolph = "🔴";

type Reindeer =
    | Dasher
    | Dancer
    | Prancer
    | Vixen
    | Comet
    | Cupid
    | Donner
    | Blitzen
    | Rudolph;

export type Validate<Board extends SudokuBoard> =
    AreRowsValid<Board> extends true
        ? AreColsValid<Board> extends true
            ? AreRegionsValid<Board> extends true
                ? true
                : false
            : false
        : false;

type IsValid<T extends unknown[]> = T extends Reindeer[]
    ? T["length"] extends 9
        ? AllUnique<T>
        : false
    : false;

type AllUnique<T extends Reindeer[], Seen = never> = T extends [
    infer Head extends Reindeer,
    ...infer Rest extends Reindeer[]
]
    ? Head extends Seen
        ? false
        : AllUnique<Rest, Seen | Head>
    : true;

type SudokuBoard = Reindeer[][][];

type GetRow<Board extends SudokuBoard, N extends number> = Flatten<
    [Board[N][0], Board[N][1], Board[N][2]]
>;

type AreRowsValid<
    Board extends SudokuBoard,
    Acc extends Reindeer[][] = []
> = Acc["length"] extends Board["length"]
    ? true
    : IsValid<GetRow<Board, Acc["length"]>> extends true
    ? AreRowsValid<Board, [...Acc, GetRow<Board, Acc["length"]>]>
    : false;

type GetCol<
    Board extends SudokuBoard,
    N extends number,
    Acc extends Reindeer[] = []
> = Acc["length"] extends Board["length"]
    ? Acc
    : GetCol<Board, N, [...Acc, GetRow<Board, Acc["length"]>[N]]>;

type AreColsValid<
    Board extends SudokuBoard,
    Acc extends Reindeer[][] = []
> = Acc["length"] extends Board["length"]
    ? true
    : IsValid<GetCol<Board, Acc["length"]>> extends true
    ? AreColsValid<Board, [...Acc, GetCol<Board, Acc["length"]>]>
    : false;

type RegionY = [0, 0, 0, 1, 1, 1, 2, 2, 2];
type RegionX = [0, 1, 2, 0, 1, 2, 0, 1, 2];
type SliceOffset = [0, 3, 6];

type GetSlice<
    Board extends SudokuBoard,
    Slice extends 0 | 1 | 2,
    Acc extends Reindeer[][][] = []
> = Acc["length"] extends 3
    ? Acc
    : GetSlice<
          Board,
          Slice,
          [...Acc, Board[Add<SliceOffset[Slice], Acc["length"]>]]
      >;

type GetRegion<
    Board extends SudokuBoard,
    M extends 0 | 1 | 2,
    N extends 0 | 1 | 2,
    Acc extends Reindeer[][] = []
> = Acc["length"] extends 3
    ? Flatten<Acc>
    : GetRegion<Board, M, N, [...Acc, GetSlice<Board, M>[Acc["length"]][N]]>;

type AreRegionsValid<
    Board extends SudokuBoard,
    Acc extends Reindeer[][] = []
> = Acc["length"] extends Board["length"]
    ? true
    : IsValid<
          GetRegion<Board, RegionY[Acc["length"]], RegionX[Acc["length"]]>
      > extends true
    ? AreRegionsValid<
          Board,
          [
              ...Acc,
              GetRegion<Board, RegionY[Acc["length"]], RegionX[Acc["length"]]>
          ]
      >
    : false;
