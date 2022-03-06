const createArt = (settings: {
  rowSize: number;
  columnSize: number;
  defColor: string;
}) => {
  const board: { xpos: number; ypos: number; color: string }[][] = [];
  for (let i = 0; i < settings!.rowSize; i++) {
    let arr = [];
    for (let j = 0; j < settings!.columnSize; j++) {
      arr.push({ xpos: j, ypos: i, color: settings!.defColor });
    }
    board.push(arr);
  }
  return board;
};

export default createArt;
