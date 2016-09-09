class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      gameBoard: [],
      gen: 0,
      running: false,
      speed: 120,
      pause: false,
      size: [50, 30]
    };
  }

  componentWillMount() {
    this._createNewGame(1);
    this.setState({
      running: true
    });
  }

  componentDidMount() {
    this._runPause();
  }

  componentDidUnmount() {
    this.setState({
      running: false
    });
  }

  render() {
    const that = this;
    const gameBoard = this.state.gameBoard;
    var rows = gameBoard.map(function(item, i) {
      var entry = item.map(function(element, j) {
          return (<Cell toggle={that._toggleLife.bind(that)} loc={[j, i]} info={element} index={j} />)
      });
      return (
        <div className={"boardRow row"+i} key={i}>{entry}</div>
      );
    });
    return (
      <div className="gameboard">
        <h1>Conway's Game of Life</h1>
        <Header gen={this.state.gen} next={this._nextTurn.bind(this)} newBoard={this._createNewGame.bind(this)} run={this._toggleRun.bind(this)} pause={this._togglePause.bind(this)} runState={this.state.running} pauseState={this.state.pause} />
      <div>
        {rows}
        </div>
        <Footer speed={this._changeSpeed.bind(this)} newBoard={this._createNewGame.bind(this)} />
        <p>Add or remove cells by clicking on a block. Lighter cells are new in the current generation, darker cells have survived for at least one generation</p>
        <p>What is Conway's game of life? Get more info <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">here</a>.</p>
        </div>
      );
  }

  _changeSpeed(newSpeed) {
    if (this.state.running) {
      this.setState({
        speed: newSpeed,
        pause: true
      });
      setTimeout(this._toggleRun.bind(this), 15);
    } else {
      this.setState({
        speed: newSpeed
      });
    }
  }

  _toggleRun() {
    this.setState({
      pause: false,
      running: true
    }, function() {
      this._runPause();
});
  }

  _togglePause() {
    console.log("toggle pause");
    this.setState({
      pause: true
    });
  }

  _runPause() {
    let that = this;
    let speed = this.state.speed;

    var pause = function() {
      clearInterval(turn);
      clearInterval(check);
      that.setState({
        running: false
      });
    };

    var check = setInterval(function() {
      if (this.state.pause) {
        pause();
      }
    }.bind(this), 10);

    var turn = setInterval(this._nextTurn.bind(this), speed);
  }

  _nextTurn() {
    let arr = this.state.gameBoard;
    arr.push(arr[0]);
    arr.unshift(arr[arr.length-2]);
    let nextArr = [];
    const rLen = arr[0].length-1;

    for (let i = 1; i < arr.length -1; i ++) {

      nextArr.push([]);
      arr[i].forEach(function(cell, j) {
        let neighbors = [arr[i-1][j-1], arr[i-1][j], arr[i-1][j+1], arr[i][j-1], arr[i][j+1], arr[i+1][j-1], arr[i+1][j], arr[i+1][j+1]];
    let leftEdge = [arr[i-1][rLen], arr[i-1][j], arr[i-1][j+1], arr[i][rLen], arr[i][j+1], arr[i+1][rLen], arr[i+1][j], arr[i+1][j+1]];
    let rightEdge = [arr[i-1][j-1], arr[i-1][j], arr[i-1][0], arr[i][j-1], arr[i][0], arr[i+1][j-1], arr[i+1][j], arr[i+1][0]];
        let use = neighbors;
        j === 0 ? use = leftEdge : j === rLen ? use = rightEdge : use;
        let total = 0;
        use.forEach(function(val) {
          if (val) {
          total++;
          }
        });
        let result = 0;
        if (total === 2 && cell) {
          result = 2;
        } else if (total === 3) {
          cell ? result = 2 : result = 1;
        }
        nextArr[i-1].push(result);
      });
    }
    this.setState({
      gameBoard: nextArr,
      gen: this.state.gen + 1
    });
  }

  _toggleLife(status, loc) {
    let gameBoard = this.state.gameBoard;
    status++;
    status === 3 ? status = 0 : status;
    gameBoard[loc[1]][loc[0]] = status;
    this.setState({
      gameBoard: gameBoard
    });
  }
  _getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  _createNewGame(max, size = this.state.size) {
    if (this.state.running) {
      this._togglePause();
    }

    let gameBoard = [];
    for (let i = 0; i < size[1]; i ++) {
      gameBoard.push([]);
      for (let j = 0; j < size[0]; j ++) {
        gameBoard[i].push(this._getRandom(0, max));
      }
    }
    this.setState({
      gameBoard: gameBoard,
      gen: 0,
      size: size
    });
  }
}

class Cell extends React.Component {
  render() {
    let status;
    status = !this.props.info ? "dead" : this.props.info === 1 ? "young" : "alive";
    status += " cell"
    return (
      <div onClick={this._handleClick.bind(this)} className={status} key={this.props.index}></div>
    );
  }

  _handleClick(e) {
    e.preventDefault();
    this.props.toggle(this.props.info, this.props.loc);
  }
}

class Header extends React.Component {
  render() {
    return (
      <div>
        <button onClick={this._handleRunPause.bind(this)}>Start</button>
        <button onClick={this._handlePause.bind(this)}>Pause</button>
        <button onClick={this._handleNext.bind(this)}>One Turn</button>
        <button onClick={this._handleNewBoard.bind(this, 0)}>Clear Board</button>
        <button onClick={this._handleNewBoard.bind(this, 1)}>New Random Game</button>
        <span>Generation: {this.props.gen}</span>
        </div>
    );
  }

  _handleRunPause(e) {
    e.preventDefault();
    if (!this.props.runState) {
      this.props.run();
    }
  }

  _handlePause(e) {
    e.preventDefault();
    this.props.pause();
  }

  _handleNewBoard(createVal, e) {
    console.log(createVal);
    e.preventDefault();
    this.props.newBoard(createVal);
  }

  _handleNext(e) {
    e.preventDefault();
    if (!this.props.runState || this.props.pauseState) {
      this.props.next();
    }
  }
}

class Footer extends React.Component {
  render() {
    return (
      <div>
        <button onClick={this._handleSpeed.bind(this, 500)}>Slow</button>
        <button onClick={this._handleSpeed.bind(this, 250)}>Medium</button>
        <button onClick={this._handleSpeed.bind(this, 120)}>Fast</button>
        <button onClick={this._handleSize.bind(this, [20, 20])}>20 x 20</button>
        <button onClick={this._handleSize.bind(this, [50, 30])}>50 x 30</button>
        <button onClick={this._handleSize.bind(this, [70, 50])}>70 x 50</button>
        </div>
    )
  }

    _handleSize(arr, e) {
    e.preventDefault();
    this.props.newBoard(1, arr);
  }

  _handleSpeed(num, e) {
    e.preventDefault();
    this.props.speed(num);
  }
}

ReactDOM.render(
  <Board />, document.getElementById("container")
);
