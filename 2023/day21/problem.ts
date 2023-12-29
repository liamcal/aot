import { Pop } from "../../utils";

type TicTacToeChip = "❌" | "⭕";
type TicTacToeEndState = "❌ Won" | "⭕ Won" | "Draw";
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = "  ";
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = "top" | "middle" | "bottom";
type TicTacToeXPositions = "left" | "center" | "right";
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type TicTactToeBoard = TicTacToeCell[][];
type TicTacToeGame = {
    board: TicTactToeBoard;
    state: TicTacToeState;
};

type EmptyBoard = [["  ", "  ", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];

export type NewGame = {
    board: EmptyBoard;
    state: "❌";
};

type Rows = { top: 0; middle: 1; bottom: 2 };
type Cols = { left: 0; center: 1; right: 2 };

export type TicTacToe<
    Game extends TicTacToeGame,
    Position extends TicTacToePositions
> = {
    board: GetBoard<Game, Position>;
    state: GetState<Game, Position, GetBoard<Game, Position>>;
};

type GetBoard<
    Game extends TicTacToeGame,
    Position extends TicTacToePositions
> = Game["state"] extends TicTacToeChip
    ? PlaceMoveOnBoard<
          Game["board"],
          Game["state"],
          GetRow<Position>,
          GetCol<Position>
      >
    : never;

type GetState<
    Game extends TicTacToeGame,
    Position extends TicTacToePositions,
    NewBoard extends TicTactToeBoard
> =
    | IsWin<NewBoard>
    | IsDraw<NewBoard>
    | IsInvalid<Game, GetRow<Position>, GetCol<Position>> extends never
    ? Game["state"] extends "⭕"
        ? "❌"
        : "⭕"
    :
          | IsWin<NewBoard>
          | IsDraw<NewBoard>
          | IsInvalid<Game, GetRow<Position>, GetCol<Position>>;

type GetRow<Position extends TicTacToePositions> =
    Position extends `${infer R extends TicTacToeYPositions}-${string}`
        ? Rows[R]
        : never;
type GetCol<Position extends TicTacToePositions> =
    Position extends `${string}-${infer C extends TicTacToeXPositions}`
        ? Cols[C]
        : never;

type PlaceMoveOnBoard<
    Board extends TicTactToeBoard,
    Chip extends TicTacToeChip,
    Row extends number,
    Col extends number,
    Acc extends TicTacToeCell[][] = []
> = Acc["length"] extends 3
    ? Acc
    : Acc["length"] extends Row
    ? PlaceMoveOnBoard<
          Board,
          Chip,
          Row,
          Col,
          [...Acc, PlaceMoveInRow<Board[Acc["length"]], Chip, Col>]
      >
    : PlaceMoveOnBoard<Board, Chip, Row, Col, [...Acc, Board[Acc["length"]]]>;

type PlaceMoveInRow<
    Row extends TicTacToeCell[],
    Chip extends TicTacToeChip,
    Col extends number,
    Acc extends TicTacToeCell[] = []
> = Acc["length"] extends 3
    ? Acc
    : Acc["length"] extends Col
    ? Row[Acc["length"]] extends TicTacToeEmptyCell
        ? PlaceMoveInRow<Row, Chip, Col, [...Acc, Chip]>
        : PlaceMoveInRow<Row, Chip, Col, [...Acc, Row[Acc["length"]]]>
    : PlaceMoveInRow<Row, Chip, Col, [...Acc, Row[Acc["length"]]]>;

type IsWin<Board extends TicTactToeBoard> =
    | IsHorizontalWin<Board>
    | IsVerticalWin<Board>
    | IsDiagonalWin<Board>;

type IsHorizontalWin<
    Board extends TicTactToeBoard,
    Row extends number = -1,
    Found extends TicTacToeCell[] = []
> = Row extends -1
    ?
          | IsHorizontalWin<Board, 0>
          | IsHorizontalWin<Board, 1>
          | IsHorizontalWin<Board, 2>
    : Found["length"] extends 3
    ? GetResult<Found>
    : IsHorizontalWin<Board, Row, [...Found, Board[Row][Found["length"]]]>;

type IsVerticalWin<
    Board extends TicTactToeBoard,
    Col extends number = -1,
    Found extends TicTacToeCell[] = []
> = Col extends -1
    ?
          | IsVerticalWin<Board, 0>
          | IsVerticalWin<Board, 1>
          | IsVerticalWin<Board, 2>
    : Found["length"] extends 3
    ? GetResult<Found>
    : IsVerticalWin<Board, Col, [...Found, Board[Found["length"]][Col]]>;

type IsDiagonalWin<Board extends TicTactToeBoard> =
    | IsLeftDiagonalWin<Board>
    | IsRightDiagonalWin<Board>;

type IsLeftDiagonalWin<
    Board extends TicTactToeBoard,
    Found extends TicTacToeCell[] = []
> = Found["length"] extends 3
    ? GetResult<Found>
    : IsLeftDiagonalWin<
          Board,
          [...Found, Board[Found["length"]][Found["length"]]]
      >;

type IsRightDiagonalWin<
    Board extends TicTactToeBoard,
    Found extends TicTacToeCell[] = [],
    ReverseFound extends 0[] = [0, 0]
> = Found["length"] extends 3
    ? GetResult<Found>
    : IsRightDiagonalWin<
          Board,
          [...Found, Board[Found["length"]][ReverseFound["length"]]],
          Pop<ReverseFound>
      >;

type GetResult<Tiles extends TicTacToeCell[]> = Tiles extends ["⭕", "⭕", "⭕"]
    ? "⭕ Won"
    : Tiles extends ["❌", "❌", "❌"]
    ? "❌ Won"
    : never;

type IsDraw<Board extends TicTactToeBoard> = Board extends TicTacToeChip[][]
    ? "Draw"
    : never;

type IsInvalid<
    Game extends TicTacToeGame,
    Row extends number,
    Col extends number
> = Game["board"][Row][Col] extends TicTacToeEmptyCell
    ? never
    : Game["state"] extends TicTacToeChip
    ? Game["state"]
    : never;
