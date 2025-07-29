import Cell from "./Cell";
import type { t_cell } from "../minesweeper";

interface BoardProps {
    board: t_cell[][];
    onClick: (x: number, y: number) => void;
    onRightClick: (x: number, y: number) => void;
}

const Board = ({ board, onClick, onRightClick }: BoardProps) => {

    return (
        <div className="flex flex-col border">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                    {row.map(cell => (
                        <Cell
                            key={`${cell.x}-${cell.y}`}
                            cell={cell}
                            onClick={onClick}
                            onRightClick={onRightClick}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}

export default Board;