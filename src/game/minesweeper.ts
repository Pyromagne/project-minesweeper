export type t_cell = {
    x: number;
    y: number;
    isBomb: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    adjacentBombs: number;
};

export type t_timestamp = {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}

export type board = {
    name: string;
    width: number;
    height: number;
}

import { FaBomb, FaFlag } from "react-icons/fa6";

export const icon = {
    flag: FaFlag,
    bomb: FaBomb
}

export function pad(n: number, size = 2): string {
    return n.toString().padStart(size, '0');
}