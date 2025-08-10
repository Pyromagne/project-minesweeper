import { useState, useEffect } from "react";

type ScoreEntry = {
    name: string;
    difficulty: string;
    timestamp: string;
    date: string;
};

interface UseStorageResult {
    name: string;
    scores: ScoreEntry[];
    setName: (newName: string) => void;
    addScore: (score: ScoreEntry) => void;
    resetStorage: () => void;
}

const NAME_KEY = "minesweeper_name";
const SCORES_KEY = "minesweeper_scores";

export function useStorage(): UseStorageResult {
    const [name, setNameState] = useState<string>("Unknown Player");
    const [scores, setScores] = useState<ScoreEntry[]>([]);

    useEffect(() => {
        const storedName = localStorage.getItem(NAME_KEY);
        const storedScores = localStorage.getItem(SCORES_KEY);

        if (storedName) setNameState(storedName);
        if (storedScores) setScores(JSON.parse(storedScores));
    }, []);

    const setName = (newName: string) => {
        setNameState(newName);
        localStorage.setItem(NAME_KEY, newName);
    };

    const addScore = (score: ScoreEntry) => {
        const updatedScores = [...scores, score];
        setScores(updatedScores);
        localStorage.setItem(SCORES_KEY, JSON.stringify(updatedScores));
    };

    const resetStorage = () => {
        setNameState("");
        setScores([]);
        localStorage.removeItem(NAME_KEY);
        localStorage.removeItem(SCORES_KEY);
    };

    return { name, scores, setName, addScore, resetStorage };
}
