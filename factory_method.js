class DangerousRoom extends Room {
  enter() {
    super.enter();
    console.log('WATCH OUT! THIS is a DANGEROUS room!');
  }
}

class DangerousWall extends Wall {
  enter() {
    console.log('OUCH THE WALL HURT YOU!  THAT WAS DANGEROUS!');
  }
}

class FactoryMazeGame extends MazeGame {
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

  createMaze() {
    const aMaze = this.makeMaze();
    const r1 = this.makeRoom(1);
    const r2 = this.makeRoom(2);
    const door = this.makeDoor(r1, r2);

    aMaze.addRoom(r1);
    aMaze.addRoom(r2);

    r1.setSide('north', this.makeWall());
    r1.setSide('east', door);
    r1.setSide('south', this.makeWall());
    r1.setSide('west', this.makeWall());

    r2.setSide('north', this.makeWall());
    r2.setSide('east', this.makeWall());
    r2.setSide('south', this.makeWall());
    r2.setSide('west', door);

    this.currentRoom = r1;

    return aMaze;
  }
}

class DangerousGame extends FactoryMazeGame {
  makeRoom(id) {
    return new DangerousRoom(id);
  }
  makeWall() {
    return new DangerousWall();
  }
}

console.log('--------------dangerous game--------------');

const game2 = new DangerousGame();
const fancyMaze = game2.createMaze();

game2.getCurrentRoom();
game2.tryDirection('north');
game2.tryDirection('east');
game2.tryDirection('south', 'open');
game2.tryDirection('east', 'open');
game2.tryDirection('east');
game2.tryDirection('west');
