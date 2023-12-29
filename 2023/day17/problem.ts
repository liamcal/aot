type RockPaperScissors = "👊🏻" | "🖐🏾" | "✌🏽";

type Win = { "👊🏻": "✌🏽"; "🖐🏾": "👊🏻"; "✌🏽": "🖐🏾" };

export type WhoWins<
    T extends RockPaperScissors,
    U extends RockPaperScissors
> = T extends U ? "draw" : T extends Win[U] ? "win" : "lose";
