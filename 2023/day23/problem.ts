import { Add, ExtendArr } from "../../utils";

type Connect4Chips = "🔴" | "🟡";
type Connect4Cell = Connect4Chips | "  ";
type Connect4State = "🔴" | "🟡" | "🔴 Won" | "🟡 Won" | "Draw";

type Connect4Row = Connect4Cell[];
type Connect4Board = Connect4Row[];

type EmptyBoard = [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "]
];

export type NewGame = {
    board: EmptyBoard;
    state: "🟡";
};

type Connect4Game = {
    board: Connect4Board;
    state: Connect4State;
};

export type Connect4<
    Game extends Connect4Game,
    Col extends number
> = Connect4Inner<
    Game,
    Game["state"] extends Connect4Chips
        ? PlaceChipInBoard<Game["board"], Game["state"], Col>
        : Game["board"]
>;

type PlaceItemInArray<
    Item,
    Arr extends unknown[],
    Idx extends number,
    Acc extends unknown[] = []
> = Acc["length"] extends Arr["length"]
    ? Acc
    : Acc["length"] extends Idx
    ? PlaceItemInArray<Item, Arr, Idx, [...Acc, Item]>
    : PlaceItemInArray<Item, Arr, Idx, [...Acc, Arr[Acc["length"]]]>;

type PlaceItemInMatrix<
    Item,
    Mat extends unknown[][],
    Row extends number,
    Col extends number,
    Acc extends unknown[][] = []
> = Acc["length"] extends Mat["length"]
    ? Acc
    : Acc["length"] extends Row
    ? PlaceItemInMatrix<
          Item,
          Mat,
          Row,
          Col,
          [...Acc, PlaceItemInArray<Item, Mat[Acc["length"]], Col>]
      >
    : PlaceItemInMatrix<Item, Mat, Row, Col, [...Acc, Mat[Acc["length"]]]>;

type PlaceChipInBoard<
    Board extends Connect4Board,
    Chip extends Connect4Chips,
    Col extends number,
    Acc extends unknown[] = []
> = Board[Acc["length"]][Col] extends Connect4Chips
    ? never // Invalid move
    : Board[ExtendArr<Acc>["length"]][Col] extends Connect4Chips
    ? PlaceItemInMatrix<Chip, Board, Acc["length"], Col>
    : ExtendArr<Acc>["length"] extends Board["length"]
    ? PlaceItemInMatrix<Chip, Board, Acc["length"], Col>
    : PlaceChipInBoard<Board, Chip, Col, ExtendArr<Acc>>;

type ContainsWin<
    Arr extends Connect4Cell[],
    Acc extends Connect4Cell[] = []
> = Acc["length"] extends 4
    ? `${Acc[0]} Won`
    : Arr extends [
          infer Head extends Connect4Cell,
          ...infer Tail extends Connect4Cell[]
      ]
    ? Head extends Connect4Chips
        ? Acc["length"] extends 0
            ? ContainsWin<Tail, [Head]>
            : Head extends Acc[0]
            ? ContainsWin<Tail, [...Acc, Head]>
            : ContainsWin<Tail, []>
        : ContainsWin<Tail, []>
    : never;

type GetRow<Board extends Connect4Board, Row extends number> = Board[Row];

type ContainsRowWin<
    Board extends Connect4Board,
    Acc extends unknown[] = []
> = Acc["length"] extends Board["length"]
    ? never
    : ContainsWin<GetRow<Board, Acc["length"]>> extends never
    ? ContainsRowWin<Board, ExtendArr<Acc>>
    : ContainsWin<GetRow<Board, Acc["length"]>>;

type GetCol<
    Board extends Connect4Board,
    Col extends number,
    Acc extends Connect4Cell[] = []
> = Acc["length"] extends Board["length"]
    ? Acc
    : GetCol<Board, Col, [...Acc, GetRow<Board, Acc["length"]>[Col]]>;

type ContainsColWin<
    Board extends Connect4Board,
    Acc extends unknown[] = []
> = Acc["length"] extends Board["length"]
    ? never
    : ContainsWin<GetCol<Board, Acc["length"]>> extends never
    ? ContainsColWin<Board, ExtendArr<Acc>>
    : ContainsWin<GetCol<Board, Acc["length"]>>;

type GetRightDiagonal<
    Board extends Connect4Board,
    Row extends number,
    Col extends number,
    Acc extends Connect4Cell[] = []
> = Add<Row, Acc["length"]> extends Board["length"]
    ? Acc
    : Add<Col, Acc["length"]> extends Board[0]["length"]
    ? Acc
    : GetRightDiagonal<
          Board,
          Row,
          Col,
          [...Acc, Board[Add<Row, Acc["length"]>][Add<Col, Acc["length"]>]]
      >;

type ContainsRightDiagonalWin<
    Board extends Connect4Board,
    RowAcc extends unknown[] = [],
    ColAcc extends unknown[] = []
> = RowAcc["length"] extends Board["length"]
    ? never
    : ColAcc["length"] extends Board[0]["length"]
    ? ContainsRightDiagonalWin<Board, ExtendArr<RowAcc>, []>
    : ContainsWin<
          GetRightDiagonal<Board, RowAcc["length"], ColAcc["length"]>
      > extends never
    ? ContainsRightDiagonalWin<Board, RowAcc, ExtendArr<ColAcc>>
    : ContainsWin<GetRightDiagonal<Board, RowAcc["length"], ColAcc["length"]>>;

type ReverseArray<
    Arr extends unknown[],
    Acc extends unknown[] = []
> = Arr extends [...infer Head, infer Tail]
    ? ReverseArray<Head, [...Acc, Tail]>
    : Acc;

type ReverseMatrixRows<
    Mat extends unknown[][],
    Acc extends unknown[][] = []
> = Acc["length"] extends Mat["length"]
    ? Acc
    : ReverseMatrixRows<Mat, [...Acc, ReverseArray<Mat[Acc["length"]]>]>;

type ContainsLeftDiagonalWin<Board extends Connect4Board> =
    ContainsRightDiagonalWin<ReverseMatrixRows<Board>>;

type ContainsDraw<
    Board extends Connect4Board,
    Acc extends unknown[] = []
> = Acc["length"] extends Board["length"]
    ? "Draw"
    : Board[Acc["length"]] extends Connect4Chips[]
    ? ContainsDraw<Board, ExtendArr<Acc>>
    : never;

type Connect4Inner<
    Game extends Connect4Game,
    NewBoard extends Connect4Board
> = {
    board: NewBoard;
    state: GetState<Game, NewBoard>;
};

type IsGameOver<Board extends Connect4Board> =
    | ContainsDraw<Board>
    | ContainsRowWin<Board>
    | ContainsColWin<Board>
    | ContainsRightDiagonalWin<Board>
    | ContainsLeftDiagonalWin<Board>;

type GetState<
    Game extends Connect4Game,
    NewBoard extends Connect4Board
> = IsGameOver<NewBoard> extends never
    ? Game["state"] extends "🟡"
        ? "🔴"
        : "🟡"
    : IsGameOver<NewBoard>;
