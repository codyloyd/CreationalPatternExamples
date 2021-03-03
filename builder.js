class MazeBuilder {
  constructor() {}
  buildMaze() {}
  buildRoom() {}
  buildDoor() {}

  getMaze() {}
}

class StandardMazeBuilder extends MazeBuilder {
  constructor() {
    super()
    this._currentMaze = null
  }

  buildMaze() {
    this._currentMaze = new Maze()
  }

  buildRoom(id) {
    if (!this._currentMaze.getRoom(id)) {
      const room = new Room(id)

      room.setSide('north', new Wall())
      room.setSide('east', new Wall())
      room.setSide('south', new Wall())
      room.setSide('west', new Wall())

      this._currentMaze.addRoom(room)
    }
  }

  buildDoor(id1, dir1, id2, dir2) {
    const r1 = this._currentMaze.getRoom(id1)
    const r2 = this._currentMaze.getRoom(id2)

    const door = new Door(r1, r2)
    r1.setSide(dir1, door)
    r2.setSide(dir2, door)
  }

  getMaze() {
    return this._currentMaze
  }
}

class BuilderMazeGame extends MazeGame {
  createMaze(builder) {
    builder.buildMaze()
    builder.buildRoom(1)
    builder.buildRoom(2)
    builder.buildDoor(1, 'east', 2, 'west')

    const maze = builder.getMaze()
    this.currentRoom = maze.getRoom(1)

    return maze
  }
}


console.log('--------------builder game--------------');
const builder_game = new BuilderMazeGame();
const builder = new StandardMazeBuilder()
const the_maze = builder_game.createMaze(builder);

builder_game.getCurrentRoom();
builder_game.tryDirection('north');
builder_game.tryDirection('east');
builder_game.tryDirection('south', 'open');
builder_game.tryDirection('east', 'open');
builder_game.tryDirection('east');
builder_game.tryDirection('west');