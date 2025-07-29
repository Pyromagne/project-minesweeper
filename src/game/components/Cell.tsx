import type { t_cell } from "../minesweeper";
import { icon } from "../minesweeper";

type CellProps = {
    cell: t_cell;
    onLeftClick: (x: number, y: number) => void;
    onRightClick: (x: number, y: number) => void;
};

const Cell = ({ cell, onLeftClick, onRightClick }: CellProps) => {
    const { x, y, isRevealed, isBomb, adjacentBombs, isFlagged } = cell;

    let display = '';
    if (isFlagged) display = icon.flag;
    else if (isRevealed) display = isBomb ? icon.bomb : adjacentBombs ? adjacentBombs.toString() : '';

    return (
        <div
            className={`w-10 h-10 border flex items-center justify-center text-xs cursor-pointer select-none ${isRevealed ? 'bg-gray-200' : 'bg-gray-400'
                }`}
            onClick={() => onLeftClick(x, y)}
            onContextMenu={(e) => {
                e.preventDefault();
                onRightClick(x, y);
            }}
        >
            {display}
        </div>
    );
};

export default Cell;