import type { board } from "./minesweeper";

export const easy_board: board = {
    name: "Easy",
    width: 10,
    height: 10,
};

export const normal_board: board = {
    name: "Normal", 
    width: 14,
    height: 14,
};

export const hard_board: board = {
    name: "Hard",
    width: 18,
    height: 18,
};

export const expert_board: board = {
    name: "Expert",
    width: 22,
    height: 22,
};

export const difficulties: board[] = [easy_board, normal_board, hard_board, expert_board];
export const difficultiesName: string[] = difficulties.map(d => d.name);