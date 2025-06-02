export const puzzlePieces = [
  {
    src: "/static/puzzles/completed/1.png",
    originalWidth: 0,
    originalHeight: 0,
    x: 276,
    y: 730,
  },
  {
    src: "/static/puzzles/completed/2.png",
    originalWidth: 0,
    originalHeight: 0,
    x: 566,
    y: 730,
  },
  {
    src: "/static/puzzles/completed/3.png",
    originalWidth: 0,
    originalHeight: 0,
    x: 1104,
    y: 730,
  },
  {
    src: "/static/puzzles/completed/4.png",
    originalWidth: 0,
    originalHeight: 0,
    x: 276,
    y: 1141,
  },
  {
    src: "/static/puzzles/completed/5.png",
    originalWidth: 0,
    originalHeight: 0,
    x: 684,
    y: 1027,
  },
  {
    src: "/static/puzzles/completed/6.png",
    originalWidth: 0,
    originalHeight: 0,
    x: 998,
    y: 1141,
  },
  {
    src: "/static/puzzles/completed/7.png",
    originalWidth: 0,
    originalHeight: 0,
    x: 276,
    y: 1434,
  },
  {
    src: "/static/puzzles/completed/8.png",
    originalWidth: 0,
    originalHeight: 0,
    x: 568,
    y: 1562,
  },
  {
    src: "/static/puzzles/completed/9.png",
    originalWidth: 0,
    originalHeight: 0,
    x: 1104,
    y: 1434,
  },
];

// 灰色拼图底板数据
export const puzzleBackgroundPieces = [
  {
    src: "/static/puzzles/1.png",
    originalWidth: 0,
    originalHeight: 0,
    x: 276,
    y: 730,
  },
  {
    src: "/static/puzzles/2.png",
    originalWidth: 0,
    originalHeight: 0,
    x: 566,
    y: 730,
  },
  {
    src: "/static/puzzles/3.png",
    originalWidth: 0,
    originalHeight: 0,
    x: 1104,
    y: 730,
  },
  {
    src: "/static/puzzles/4.png",
    originalWidth: 0,
    originalHeight: 0,
    x: 276,
    y: 1141,
  },
  {
    src: "/static/puzzles/5.png",
    originalWidth: 0,
    originalHeight: 0,
    x: 684,
    y: 1027,
  },
  {
    src: "/static/puzzles/6.png",
    originalWidth: 0,
    originalHeight: 0,
    x: 998,
    y: 1141,
  },
  {
    src: "/static/puzzles/7.png",
    originalWidth: 0,
    originalHeight: 0,
    x: 276,
    y: 1434,
  },
  {
    src: "/static/puzzles/8.png",
    originalWidth: 0,
    originalHeight: 0,
    x: 568,
    y: 1562,
  },
  {
    src: "/static/puzzles/9.png",
    originalWidth: 0,
    originalHeight: 0,
    x: 1104,
    y: 1434,
  },
];

//这个数据是基于 1791.68px * 3883.35px

// 计算并调整拼图位置到左上角
export function adjustPuzzlePosition(pieces: PuzzlePiece[]): PuzzlePiece[] {
  // 找到最小的x和y值
  const minX = Math.min(...pieces.map((p) => p.x));
  const minY = Math.min(...pieces.map((p) => p.y));

  // 调整所有拼图块的位置
  return pieces.map((piece) => ({
    ...piece,
    x: piece.x - minX,
    y: piece.y - minY,
  }));
}

// 导出调整后的拼图数据
export const adjustedPuzzlePieces = adjustPuzzlePosition(puzzlePieces);
export const adjustedBackgroundPieces = adjustPuzzlePosition(
  puzzleBackgroundPieces
);

// Define the type for better intellisense/safety
export interface PuzzlePiece {
  src: string;
  originalWidth: number;
  originalHeight: number;
  x: number;
  y: number;
}
