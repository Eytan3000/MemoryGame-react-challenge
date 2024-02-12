import { useState } from 'react';
import './App.css';

interface Cell {
  value: number;
  state: boolean;
  done: boolean;
}

interface Selected {
  cell: Cell;
  index: number;
}

function Card({
  cell,
  handleClick,
  index,
}: {
  cell: Cell;
  handleClick: (cell: Cell, index: number) => void;
  index: number;
}) {
  return (
    <>
      <div
        onClick={() => handleClick(cell, index)}
        className="card"
        style={{
          background: cell.state ? '' : '#a19f9f',
        }}>
        {cell.state && cell.value}
      </div>
    </>
  );
}

function wait(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve();
    }, 1000);
  });
}

function createNumsArr(length: number) {
  const arr = [];
  for (let i = 0; i < length / 2; i++) {
    arr.push(i, i);
  }
  return arr.sort(() => Math.random() - 0.5);
}

function createGrid(length: number) {
  const numsArr = createNumsArr(length);
  return numsArr.map((num) => ({ value: num, state: false, done: false }));
}

function App() {
  // const [grid, setGrid] = useState<Cell[]>([
  //   { value: 0, state: false, done: false },
  //   { value: 3, state: false, done: false },
  //   { value: 5, state: false, done: false },
  //   { value: 1, state: false, done: false },

  //   { value: 1, state: false, done: false },
  //   { value: 2, state: false, done: false },
  //   { value: 2, state: false, done: false },
  //   { value: 4, state: false, done: false },

  //   { value: 4, state: false, done: false },
  //   { value: 3, state: false, done: false },
  //   { value: 5, state: false, done: false },
  //   { value: 0, state: false, done: false },
  // ]);

  const [grid, setGrid] = useState<Cell[]>(createGrid(12));
  const [selected, setSelected] = useState<Selected>();
  const [block, setBlock] = useState<boolean>();

  function revealCard(index: number) {
    setGrid(
      grid.map((cell, idx) => {
        if (idx === index) {
          cell.state = true;
        }
        return cell;
      })
    );
    // const gridTemp = grid;
    // grid[index].state = true;
    // setGrid([...gridTemp]);
  }

  function hideCard(index: number) {
    setGrid(
      grid.map((cell, idx) => {
        if (idx === index) {
          cell.state = false;
        }
        return cell;
      })
    );
    // const gridTemp = grid;
    // grid[index].state = false;
    // setGrid([...gridTemp]);
  }

  function setDone(index: number) {
    setGrid(
      grid.map((cell, idx) => {
        if (idx === index) {
          cell.done = true;
        }
        return cell;
      })
    );

    // const gridTemp = grid;
    // grid[index].done = true;
    // setGrid([...gridTemp]);
  }

  async function handleClick(cell: Cell, index: number) {
    if (cell.done) return;
    if (block) return;

    if (selected === undefined) {
      setSelected({ cell, index });
    } else {
      setBlock(true);
    }
    revealCard(index);

    if (selected) {
      if (selected.cell.value === cell.value) {
        // if match
        setDone(index);
        setDone(selected.index);
      } else {
        await wait();
        hideCard(index);
        hideCard(selected.index);
      }
      setSelected(undefined);
      setBlock(false);
    }
  }
  if (grid.filter((cell) => cell.done === false).length === 0) {
    return <>Congratulations!</>;
  } //if all are done game finished

  return (
    <>
      <div className="main-div">
        {grid.map((cell, index) => (
          <Card
            key={index}
            cell={cell}
            handleClick={handleClick}
            index={index}
          />
        ))}
      </div>
    </>
  );
}

export default App;
