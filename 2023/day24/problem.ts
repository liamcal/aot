import {
    Decrement,
    FindInMatrix,
    Increment,
    PlaceItemInMatrix,
    ReplaceInMatrix,
} from "../../utils";

type Alley = "  ";
type Santa = "🎅";
type Wall = "🎄";
type MazeItem = Wall | Santa | Alley;
type DELICIOUS_COOKIES = "🍪";
type MazeMatrix = MazeItem[][];
type Directions = "up" | "down" | "left" | "right";

export type Move<
    Maze extends MazeMatrix,
    Direction extends Directions
> = EvaluateMove<Maze, Direction, MovePosition<FindSanta<Maze>, Direction>>;

type Position = [number, number];

type PlaceItemInMatrixAtPosition<
    Mat extends unknown[][],
    Item,
    Pos extends Position,
    Acc extends unknown[][] = []
> = PlaceItemInMatrix<Mat, Item, Pos[0], Pos[1]>;

type MovePosition<
    Pos extends Position,
    Direction extends Directions
> = Direction extends "up"
    ? [Decrement<Pos[0]>, Pos[1]]
    : Direction extends "down"
    ? [Increment<Pos[0]>, Pos[1]]
    : Direction extends "left"
    ? [Pos[0], Decrement<Pos[1]>]
    : [Pos[0], Increment<Pos[1]>];

type FindSanta<Maze extends MazeMatrix> = FindInMatrix<Maze, Santa>;

type MoveSanta<
    Maze extends MazeMatrix,
    SantaPos extends Position,
    Direction extends Directions
> = PlaceItemInMatrixAtPosition<
    ReplaceInMatrix<Maze, Santa, Alley>,
    Santa,
    MovePosition<SantaPos, Direction> extends Position
        ? MovePosition<SantaPos, Direction>
        : SantaPos
>;

// Keyof is too broad to work properly
type GetArrayKeys<
    Arr extends unknown[],
    Acc extends number[] = []
> = Arr extends [infer Head, ...infer Tail extends unknown[]]
    ? GetArrayKeys<Tail, [...Acc, Acc["length"]]>
    : Acc[number];

type GetWidth<Maze extends MazeMatrix> = GetArrayKeys<Maze[0]>;
type GetHeight<Maze extends MazeMatrix> = GetArrayKeys<Maze>;

type IsInBounds<Maze extends MazeMatrix, Pos extends unknown[]> = Pos extends [
    number,
    number
]
    ? Pos[0] extends GetHeight<Maze>
        ? Pos[1] extends GetWidth<Maze>
            ? true
            : false
        : false
    : false;

type IsOpen<
    Maze extends MazeMatrix,
    Pos extends Position
> = Maze[Pos[0]][Pos[1]] extends Alley ? true : false;

type COOKIES<
    Maze extends MazeMatrix,
    RowAcc extends DELICIOUS_COOKIES[][] = [],
    ColAcc extends DELICIOUS_COOKIES[] = []
> = Maze extends [
    infer Head extends MazeItem[],
    ...infer Tail extends MazeMatrix
]
    ? ColAcc["length"] extends Head["length"]
        ? COOKIES<Tail, [...RowAcc, ColAcc], []>
        : COOKIES<Maze, RowAcc, [...ColAcc, DELICIOUS_COOKIES]>
    : RowAcc;

type EvaluateMove<
    Maze extends MazeMatrix,
    Direction extends Directions,
    NewPosition extends unknown[]
> = IsInBounds<Maze, NewPosition> extends true
    ? IsOpen<Maze, NewPosition & Position> extends true
        ? MoveSanta<Maze, FindSanta<Maze>, Direction>
        : Maze
    : COOKIES<Maze>;
