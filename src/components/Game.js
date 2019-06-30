import React, { Component } from 'react';
import Board from './Board';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        currentLocation: getLocation(i),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  sortMoves() {
    this.setState({
      isAscending: !this.state.isAscending
    }); 
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const { winner, winnerRow } = calculateWinner(current.squares);

    // History of steps
    const moves = history.map((step, move) => {
      const currentLocation = step.currentLocation ? `(${step.currentLocation})` : '';
      const description = move 
        ? 'Go to move #' + move
        : 'Go to game start';
      const classButton = move === this.state.stepNumber ? 'button-bold' : '';

      return (
        <li key={move}>
          <button className={`${classButton} button`} onClick={() => this.jumpTo(move)}>{description} {currentLocation}</button>
        </li>
      );
    });

    // Check for winner
    let status;
    if (winner) {
      status = 'Winner: ' + winner; 
    } else if (history.length === 10) {
      status = 'Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const isAscending = this.state.isAscending;
    if (!isAscending) {
      moves.reverse();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winnerSquares={winnerRow}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button className="button" onClick={() => this.sortMoves()}>
            Sort moves
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winnerRow: lines[i] };
    }
  }
  return { winner: null, winnerRow: null };
}

function getLocation(move) {
  const locationMap = {
    0: 'row: 1, col: 1',
    1: 'row: 1, col: 2',
    2: 'row: 1, col: 3',
    3: 'row: 2, col: 1',
    4: 'row: 2, col: 2',
    5: 'row: 2, col: 3',
    6: 'row: 3, col: 1',
    7: 'row: 3, col: 2',
    8: 'row: 3, col: 3',
  }

  return locationMap[move];
}

export default Game;
