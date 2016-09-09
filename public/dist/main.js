"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Board = function (_React$Component) {
  _inherits(Board, _React$Component);

  function Board() {
    _classCallCheck(this, Board);

    var _this = _possibleConstructorReturn(this, (Board.__proto__ || Object.getPrototypeOf(Board)).call(this));

    _this.state = {
      gameBoard: [],
      gen: 0,
      running: false,
      speed: 120,
      pause: false,
      size: [50, 30]
    };
    return _this;
  }

  _createClass(Board, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this._createNewGame(1);
      this.setState({
        running: true
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this._runPause();
    }
  }, {
    key: "componentDidUnmount",
    value: function componentDidUnmount() {
      this.setState({
        running: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var that = this;
      var gameBoard = this.state.gameBoard;
      var rows = gameBoard.map(function (item, i) {
        var entry = item.map(function (element, j) {
          return React.createElement(Cell, { toggle: that._toggleLife.bind(that), loc: [j, i], info: element, index: j });
        });
        return React.createElement(
          "div",
          { className: "boardRow row" + i, key: i },
          entry
        );
      });
      return React.createElement(
        "div",
        { className: "gameboard" },
        React.createElement(
          "h1",
          null,
          "Conway's Game of Life"
        ),
        React.createElement(Header, { gen: this.state.gen, next: this._nextTurn.bind(this), newBoard: this._createNewGame.bind(this), run: this._toggleRun.bind(this), pause: this._togglePause.bind(this), runState: this.state.running, pauseState: this.state.pause }),
        React.createElement(
          "div",
          null,
          rows
        ),
        React.createElement(Footer, { speed: this._changeSpeed.bind(this), newBoard: this._createNewGame.bind(this) }),
        React.createElement(
          "p",
          null,
          "Add or remove cells by clicking on a block. Lighter cells are new in the current generation, darker cells have survived for at least one generation"
        ),
        React.createElement(
          "p",
          null,
          "What is Conway's game of life? Get more info ",
          React.createElement(
            "a",
            { href: "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" },
            "here"
          ),
          "."
        )
      );
    }
  }, {
    key: "_changeSpeed",
    value: function _changeSpeed(newSpeed) {
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
  }, {
    key: "_toggleRun",
    value: function _toggleRun() {
      this.setState({
        pause: false,
        running: true
      }, function () {
        this._runPause();
      });
    }
  }, {
    key: "_togglePause",
    value: function _togglePause() {
      console.log("toggle pause");
      this.setState({
        pause: true
      });
    }
  }, {
    key: "_runPause",
    value: function _runPause() {
      var that = this;
      var speed = this.state.speed;

      var pause = function pause() {
        clearInterval(turn);
        clearInterval(check);
        that.setState({
          running: false
        });
      };

      var check = setInterval(function () {
        if (this.state.pause) {
          pause();
        }
      }.bind(this), 10);

      var turn = setInterval(this._nextTurn.bind(this), speed);
    }
  }, {
    key: "_nextTurn",
    value: function _nextTurn() {
      var arr = this.state.gameBoard;
      arr.push(arr[0]);
      arr.unshift(arr[arr.length - 2]);
      var nextArr = [];
      var rLen = arr[0].length - 1;

      var _loop = function _loop(i) {

        nextArr.push([]);
        arr[i].forEach(function (cell, j) {
          var neighbors = [arr[i - 1][j - 1], arr[i - 1][j], arr[i - 1][j + 1], arr[i][j - 1], arr[i][j + 1], arr[i + 1][j - 1], arr[i + 1][j], arr[i + 1][j + 1]];
          var leftEdge = [arr[i - 1][rLen], arr[i - 1][j], arr[i - 1][j + 1], arr[i][rLen], arr[i][j + 1], arr[i + 1][rLen], arr[i + 1][j], arr[i + 1][j + 1]];
          var rightEdge = [arr[i - 1][j - 1], arr[i - 1][j], arr[i - 1][0], arr[i][j - 1], arr[i][0], arr[i + 1][j - 1], arr[i + 1][j], arr[i + 1][0]];
          var use = neighbors;
          j === 0 ? use = leftEdge : j === rLen ? use = rightEdge : use;
          var total = 0;
          use.forEach(function (val) {
            if (val) {
              total++;
            }
          });
          var result = 0;
          if (total === 2 && cell) {
            result = 2;
          } else if (total === 3) {
            cell ? result = 2 : result = 1;
          }
          nextArr[i - 1].push(result);
        });
      };

      for (var i = 1; i < arr.length - 1; i++) {
        _loop(i);
      }
      this.setState({
        gameBoard: nextArr,
        gen: this.state.gen + 1
      });
    }
  }, {
    key: "_toggleLife",
    value: function _toggleLife(status, loc) {
      var gameBoard = this.state.gameBoard;
      status++;
      status === 3 ? status = 0 : status;
      gameBoard[loc[1]][loc[0]] = status;
      this.setState({
        gameBoard: gameBoard
      });
    }
  }, {
    key: "_getRandom",
    value: function _getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  }, {
    key: "_createNewGame",
    value: function _createNewGame(max) {
      var size = arguments.length <= 1 || arguments[1] === undefined ? this.state.size : arguments[1];

      if (this.state.running) {
        this._togglePause();
      }

      var gameBoard = [];
      for (var i = 0; i < size[1]; i++) {
        gameBoard.push([]);
        for (var j = 0; j < size[0]; j++) {
          gameBoard[i].push(this._getRandom(0, max));
        }
      }
      this.setState({
        gameBoard: gameBoard,
        gen: 0,
        size: size
      });
    }
  }]);

  return Board;
}(React.Component);

var Cell = function (_React$Component2) {
  _inherits(Cell, _React$Component2);

  function Cell() {
    _classCallCheck(this, Cell);

    return _possibleConstructorReturn(this, (Cell.__proto__ || Object.getPrototypeOf(Cell)).apply(this, arguments));
  }

  _createClass(Cell, [{
    key: "render",
    value: function render() {
      var status = void 0;
      status = !this.props.info ? "dead" : this.props.info === 1 ? "young" : "alive";
      status += " cell";
      return React.createElement("div", { onClick: this._handleClick.bind(this), className: status, key: this.props.index });
    }
  }, {
    key: "_handleClick",
    value: function _handleClick(e) {
      e.preventDefault();
      this.props.toggle(this.props.info, this.props.loc);
    }
  }]);

  return Cell;
}(React.Component);

var Header = function (_React$Component3) {
  _inherits(Header, _React$Component3);

  function Header() {
    _classCallCheck(this, Header);

    return _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).apply(this, arguments));
  }

  _createClass(Header, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          { onClick: this._handleRunPause.bind(this) },
          "Start"
        ),
        React.createElement(
          "button",
          { onClick: this._handlePause.bind(this) },
          "Pause"
        ),
        React.createElement(
          "button",
          { onClick: this._handleNext.bind(this) },
          "One Turn"
        ),
        React.createElement(
          "button",
          { onClick: this._handleNewBoard.bind(this, 0) },
          "Clear Board"
        ),
        React.createElement(
          "button",
          { onClick: this._handleNewBoard.bind(this, 1) },
          "New Random Game"
        ),
        React.createElement(
          "span",
          null,
          "Generation: ",
          this.props.gen
        )
      );
    }
  }, {
    key: "_handleRunPause",
    value: function _handleRunPause(e) {
      e.preventDefault();
      if (!this.props.runState) {
        this.props.run();
      }
    }
  }, {
    key: "_handlePause",
    value: function _handlePause(e) {
      e.preventDefault();
      this.props.pause();
    }
  }, {
    key: "_handleNewBoard",
    value: function _handleNewBoard(createVal, e) {
      console.log(createVal);
      e.preventDefault();
      this.props.newBoard(createVal);
    }
  }, {
    key: "_handleNext",
    value: function _handleNext(e) {
      e.preventDefault();
      if (!this.props.runState || this.props.pauseState) {
        this.props.next();
      }
    }
  }]);

  return Header;
}(React.Component);

var Footer = function (_React$Component4) {
  _inherits(Footer, _React$Component4);

  function Footer() {
    _classCallCheck(this, Footer);

    return _possibleConstructorReturn(this, (Footer.__proto__ || Object.getPrototypeOf(Footer)).apply(this, arguments));
  }

  _createClass(Footer, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          { onClick: this._handleSpeed.bind(this, 500) },
          "Slow"
        ),
        React.createElement(
          "button",
          { onClick: this._handleSpeed.bind(this, 250) },
          "Medium"
        ),
        React.createElement(
          "button",
          { onClick: this._handleSpeed.bind(this, 120) },
          "Fast"
        ),
        React.createElement(
          "button",
          { onClick: this._handleSize.bind(this, [20, 20]) },
          "20 x 20"
        ),
        React.createElement(
          "button",
          { onClick: this._handleSize.bind(this, [50, 30]) },
          "50 x 30"
        ),
        React.createElement(
          "button",
          { onClick: this._handleSize.bind(this, [70, 50]) },
          "70 x 50"
        )
      );
    }
  }, {
    key: "_handleSize",
    value: function _handleSize(arr, e) {
      e.preventDefault();
      this.props.newBoard(1, arr);
    }
  }, {
    key: "_handleSpeed",
    value: function _handleSpeed(num, e) {
      e.preventDefault();
      this.props.speed(num);
    }
  }]);

  return Footer;
}(React.Component);

ReactDOM.render(React.createElement(Board, null), document.getElementById("container"));