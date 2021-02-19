class MazeFactory {
  makeMaze() {
    return new Maze();
  }
  makeWall() {
    return new Wall();
  }
  makeRoom(id) {
    return new Room(id);
  }
  makeDoor(roomOne, roomTwo) {
    return new Door(roomOne, roomTwo);
  }
}

class FancyRoom extends Room {
  enter() {
    super.enter();
    console.log('THIS is a FANCY room!');
  }
}

class FancyWall extends Wall {
  enter() {
    console.log('You run into a FANCY wall.  It makes you feel FANCY');
  }
}

class FancyMazeFactory extends MazeFactory {
  makeRoom(id) {
    return new FancyRoom(id);
  }

  makeWall() {
    return new FancyWall();
  }
}

class FactoryMazeGame extends MazeGame {
  createMaze(mazeFactory) {
    const aMaze = mazeFactory.makeMaze();
    const r1 = mazeFactory.makeRoom(1);
    const r2 = mazeFactory.makeRoom(2);
    const door = mazeFactory.makeDoor(r1, r2);

    aMaze.addRoom(r1);
    aMaze.addRoom(r2);

    r1.setSide('north', mazeFactory.makeWall());
    r1.setSide('east', door);
    r1.setSide('south', mazeFactory.makeWall());
    r1.setSide('west', mazeFactory.makeWall());

    r2.setSide('north', mazeFactory.makeWall());
    r2.setSide('east', mazeFactory.makeWall());
    r2.setSide('south', mazeFactory.makeWall());
    r2.setSide('west', door);

    this.currentRoom = r1;

    return aMaze;
  }
}

console.log('--------------fancy game--------------');

const game2 = new MazeGame();
const fancyMazeFactory = new FancyMazeFactory();
const fancyMaze = game2.createMaze(fancyMazeFactory);

game2.getCurrentRoom();
game2.tryDirection('north');
game2.tryDirection('east');
game2.tryDirection('south', 'open');
game2.tryDirection('east', 'open');
game2.tryDirection('east');
game2.tryDirection('west');
