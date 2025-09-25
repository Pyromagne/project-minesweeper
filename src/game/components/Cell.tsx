import type { IconType } from "react-icons";
import type { t_cell } from "../minesweeper";
import { icon } from "../minesweeper";

type CellProps = {
    cell: t_cell;
    onLeftClick: (x: number, y: number) => void;
    onRightClick: (x: number, y: number) => void;
};

const Cell = ({ cell, onLeftClick, onRightClick }: CellProps) => {
    const { x, y, isRevealed, isBomb, adjacentBombs, isFlagged } = cell;

    let Display: IconType | undefined = undefined;
    let aBombs: string = '';
    if (isFlagged) Display = icon.flag;
    else if (isRevealed) {
        if (isBomb) {
            Display =  icon.bomb;
        }
        aBombs = adjacentBombs ? adjacentBombs.toString() : '';
    }

    return (
        <div
            className={`azeret-mono w-6 h-6 m-[1px] rounded-lg flex items-center justify-center text-xs cursor-pointer select-none
                ${isRevealed
                    ? 'bg-gray-200' 
                    : 'bg-gray-500'
                }`}
            onClick={() => onLeftClick(x, y)}
            onContextMenu={(e) => {
                e.preventDefault();
                onRightClick(x, y);
            }}
        >
            {Display ? <Display className={isFlagged ? "text-green-400" : "text-red-400"}/> : aBombs}
            
        </div>
    );
};

export default Cell;