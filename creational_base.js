class MapSite {
  enter() {
    throw new Error(`enter not defined on subclass of MapSite`);
  }
}

class Wall extends MapSite {
  enter() {
    console.log(`You bump into a wall`);
  }
}

class Door extends MapSite {
  constructor(roomOne, roomTwo) {
    super();
    this.roomOne = roomOne;
    this.roomTwo = roomTwo;
    this.isOpen = false;
  }
  enter(currentRoom) {
    if (this.isOpen) {
      const room = this.getNextRoom(currentRoom);
      room.enter();
      return room;
    } else {
      console.log('ouch, you bumped your nose on the door');
    }
  }
  open() {
    console.log('you open the door');
    this.isOpen = true;
  }
  getNextRoom(currentRoom) {
    let nextRoom = null;

    if (this.roomOne.roomNumber === currentRoom) {
      nextRoom = this.roomTwo;
    } else {
      nextRoom = this.roomOne;
    }

    return nextRoom;
  }
}

class Room extends MapSite {
  constructor(roomNumber) {
    super();
    this.sides = {
      north: null,
      south: null,
      east: null,
      west: null,
    };
    this.roomNumber = roomNumber;
  }

  getSide(direction) {
    return this.sides[direction];
  }

  setSide(direction, mapSite) {
    this.sides[direction] = mapSite;
  }

  enter() {
    console.log(`You are in room number ${this.roomNumber}`);
  }
}

class Maze {
  constructor() {
    this.rooms = [];
  }
  addRoom(room) {
    this.rooms.push(room);
  }
  getRoom(roomNumber) {
    return this.rooms.find((room) => room.roomNumber == roomNumber);
  }
}

class MazeGame {
  constructor() {
    this.currentRoom = null;
  }

  tryDirection(direction, action) {
    const dir = this.currentRoom.getSide(direction);
    if (action) {
      console.log(`--- trying to ${action} ${direction}`);
      if (action == 'open' && dir instanceof Door) {
        dir.open();
      } else {
        console.log("you can't open that");
      }
      return;
    }

    console.log(`--- trying to go ${direction}`);
    const newRoom = dir.enter(this.currentRoom.roomNumber);
    if (newRoom) {
      this.currentRoom = newRoom;
    }
  }

  getCurrentRoom() {
    this.currentRoom.enter();
    return this.currentRoom;
  }

  createMaze() {
    const aMaze = new Maze();
    const r1 = new Room(1);
    const r2 = new Room(2);
    const door = new Door(r1, r2);

    aMaze.addRoom(r1);
    aMaze.addRoom(r2);

    r1.setSide('north', new Wall());
    r1.setSide('east', door);
    r1.setSide('south', new Wall());
    r1.setSide('west', new Wall());

    r2.setSide('north', new Wall());
    r2.setSide('east', new Wall());
    r2.setSide('south', new Wall());
    r2.setSide('west', door);

    this.currentRoom = r1;

    return aMaze;
  }
}

console.log('--------------default game--------------');
const game = new MazeGame();
const maze = game.createMaze();

game.getCurrentRoom();
game.tryDirection('north');
game.tryDirection('east');
game.tryDirection('south', 'open');
game.tryDirection('east', 'open');
game.tryDirection('east');
game.tryDirection('west');
