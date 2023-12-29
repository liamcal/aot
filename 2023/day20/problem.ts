type Letters = {
    A: ["█▀█ ", "█▀█ ", "▀ ▀ "];
    B: ["█▀▄ ", "█▀▄ ", "▀▀  "];
    C: ["█▀▀ ", "█ ░░", "▀▀▀ "];
    E: ["█▀▀ ", "█▀▀ ", "▀▀▀ "];
    H: ["█ █ ", "█▀█ ", "▀ ▀ "];
    I: ["█ ", "█ ", "▀ "];
    M: ["█▄░▄█ ", "█ ▀ █ ", "▀ ░░▀ "];
    N: ["█▄░█ ", "█ ▀█ ", "▀ ░▀ "];
    P: ["█▀█ ", "█▀▀ ", "▀ ░░"];
    R: ["█▀█ ", "██▀ ", "▀ ▀ "];
    S: ["█▀▀ ", "▀▀█ ", "▀▀▀ "];
    T: ["▀█▀ ", "░█ ░", "░▀ ░"];
    Y: ["█ █ ", "▀█▀ ", "░▀ ░"];
    W: ["█ ░░█ ", "█▄▀▄█ ", "▀ ░ ▀ "];
    " ": ["░", "░", "░"];
    ":": ["#", "░", "#"];
    "*": ["░", "#", "░"];
};

export type ToAsciiArt<S extends string> = ToAsciiArtInner<Uppercase<S>>;

type ToAsciiArtInner<
    S extends string,
    First extends string = "",
    Second extends string = "",
    Third extends string = "",
    Acc extends string[] = []
> = S extends `${infer Head}${infer Rest}`
    ? Head extends keyof Letters
        ? ToAsciiArtInner<
              Rest,
              `${First}${Letters[Head][0]}`,
              `${Second}${Letters[Head][1]}`,
              `${Third}${Letters[Head][2]}`,
              Acc
          >
        : ToAsciiArtInner<Rest, "", "", "", [...Acc, First, Second, Third]>
    : [...Acc, First, Second, Third];
