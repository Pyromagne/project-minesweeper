import type { t_timestamp } from "../minesweeper";

/**
 * 
 * @param time timestamp
 * @returns string
 */
function timestampToString(time: t_timestamp): string {
    const { hours, minutes, seconds, milliseconds } = time;
    const pad = (num: number, size = 2) => num.toString().padStart(size, '0');
    const padMs = (num: number) => num.toString().padStart(3, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${padMs(milliseconds)}`;
}

export default timestampToString;