
var extend = require('extend-object');
var React = require('react');

var CellState = require('./CellState');

var CELL_SIZE = 20;

function styles() {
  var args = [].slice.call(arguments);
  args = args.filter(function(x) { return !!x; });
  args.unshift({});
  return extend.apply(null, args);
}

var EmptyCell = React.createClass({
  render() {
    return (
      <div style={styles(Styles.CellBase, Styles.EmptyCell)}/>
    );
  }
});

var CoveredCell = React.createClass({
  render() {
    if (this.props.isPressed) {
      return <EmptyCell/>;
    }

    var style = styles(
      Styles.CellBase,
      Styles.CoveredCell
    );

    return <div style={style}/>;
  }
});

var FlaggedCell = React.createClass({
  render() {
    var style = styles(
      Styles.CellBase,
      Styles.CoveredCell,
      Styles.ImageCell
    );

    return (
      <div style={style}>
        <img style={Styles.flag} src="img/flag.png" />
      </div>
    );
  }
});

var BombCell = React.createClass({
  render() {
    var style = styles(
      Styles.CellBase,
      Styles.EmptyCell,
      Styles.ImageCell
    );

    return (
      <div style={style}>
        <img style={Styles.flag} src="img/bomb.png" />
      </div>
    );
  }
});

var ExplodedCell = React.createClass({
  render() {
    var style = styles(
      Styles.CellBase,
      Styles.EmptyCell,
      Styles.ImageCell,
      Styles.ExplodedCell
    );

    return (
      <div style={style}>
        <img style={Styles.flag} src="img/bomb.png" />
      </div>
    );
  }
});

var ExposedCell = React.createClass({
  propTypes: {
    cell: React.PropTypes.object.isRequired
  },

  render() {
    var style = styles(
      Styles.CellBase,
      Styles.EmptyCell
    );

    if (!this.props.cell.neighborBombCount) {
      return <EmptyCell/>;
    }

    return (
      <div style={style} onClick={this.props.onExpose}>
        <span style={Styles.Count}>
          {this.props.cell.neighborBombCount}
        </span>
      </div>
    );
  },
});

var Cell = React.createClass({
  propTypes: {
    i: React.PropTypes.number.isRequired,
    j: React.PropTypes.number.isRequired,
    cell: React.PropTypes.object.isRequired,
    isPressed: React.PropTypes.bool.isRequired,
    onSelect: React.PropTypes.func.isRequired,
    onPress: React.PropTypes.func.isRequired,
    onUnpress: React.PropTypes.func.isRequired,
    onMark: React.PropTypes.func.isRequired,
    onExpose: React.PropTypes.func.isRequired,
  },

  render() {
    var left = this.props.i * CELL_SIZE;
    var top = this.props.j * CELL_SIZE;
    var style = styles({top, left}, Styles.CellWrapper);

    var cell = null;
    switch(this.props.cell.state) {
      case CellState.HIDDEN:
        if (this.props.isGameOver) {
          cell = this.props.cell.hasBomb ?
            <BombCell {...this.props} /> :
            <CoveredCell {...this.props} />;
        } else {
          cell = <CoveredCell {...this.props} />;
        }
        break;
      case CellState.EXPOSED:
        cell = <ExposedCell {...this.props} />;
        break;
      case CellState.EXPLODED:
        cell = <ExplodedCell {...this.props} />;
        break;
      case CellState.FLAGGED:
        cell = <FlaggedCell {...this.props} />;
        break;
      case CellState.QUESTION:
        cell = <QuestionCell {...this.props} />;
        break;
    }

    return (
      <div
        style={style}
        onMouseDown={this._onMouseDown}
        onMouseUp={this._onMouseUp}
        onMouseEnter={this._onMouseEnter}
        onMouseLeave={this._onMouseLeave}
        onContextMenu={this._onContextMenu}>
        {cell}
      </div>
    );
  },

  _onMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent.which === 3 || e.ctrlKey) {
      return;
    }

    this.props.onPress();
  },

  _onMouseUp(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onUnpress();

    if (e.nativeEvent.which === 3 || e.ctrlKey) {
      this.props.onMark();
    } else {
      this.props.onSelect();
    }
  },

  _onMouseLeave(e) {
    this.props.onUnpress();
  },

  _onMouseEnter(e) {
    if (e.nativeEvent.which === 1) {
      this.props.onPress();
    }
  },

  _onContextMenu(e) {
    e.preventDefault();
  }
});

var Styles = {
  CellWrapper: {
    position: 'absolute',
  },
  CellBase: {
    boxSizing: 'border-box',
    height: CELL_SIZE,
    width: CELL_SIZE,
    webkitUserSelect: 'none',
    userSelect: 'none',
  },
  CoveredCell: {
    backgroundColor: 'rgb(192, 192, 192)',
    borderWidth: 2,
    borderStyle: 'solid',
    borderRightColor: 'rgb(128, 128, 128)',
    borderLeftColor: 'rgb(255, 255, 255)',
    borderTopColor: 'rgb(255, 255, 255)',
    borderBottomColor: 'rgb(128, 128, 128)',
    borderCollapse: 'collapse',
  },
  EmptyCell: {
    backgroundColor: 'rgb(192, 192, 192)',
    borderStyle: 'solid',
    borderColor: 'rgb(128, 128, 128)',
    borderWidth: 1,
    borderCollapse: 'collapse',
  },
  Count: {
    height: CELL_SIZE,
    width: CELL_SIZE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 'bold',
    color: 'red',
    border: 'none',
  },
  ImageCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ExplodedCell: {
    backgroundColor: 'red',
  },
};

module.exports = Cell;
