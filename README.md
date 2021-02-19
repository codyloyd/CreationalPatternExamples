# Factories!

The Gang of Four Design patterns book covers two types of factory in the "Creational Patterns" section, the Abstract Factory, and the Factory Method. These patterns are very similar, so learning them at the same time is logical and can help make the distinction clear.

Basically, both factory patterns say that when you need a variant of some thing (document types, components, or rooms in a maze) you should move the instantiation of those things to a method so that you have control over which variation is created, either by subclassing whatever object holds those methods, or by passing parameters into those methods to select specific variants. The big difference between these two patterns is which object holds those creation methods.

In an **ABSTRACT FACTORY** the creation methods are moved into a special factory class which is then passed into and used by the program to create the objects it needs. Obtaining variants then requires you to subclass this factory before passing it into the object that uses it.

**FACTORY METHODS** exist in the main class that is instantiating the various objects that it needs.  In this case, you would subclass that main class to obtain the variants.

## Examples
The **Abstract Factory** example listed in the book is the creation of UI widgets that could be used in various environments with a varying look-and-feel. In their example, for instance you would create an Abstract base factory class that defines an interface for `createWindow` or `createScrollBar`.  Then you would subclass the base factory to actually define and build the individual components. TO actually build your app then, you would pass in a subclassed factory so that the app has whichever variant you choose.

The **Factory Method** example is an application that can create various types of documents.  In this example, the base class is the application that may or may not have a default document type implemented with an interface like `newDocument` and `openDocument`.  To handle different types of documents then, there are 2 options: subclassing the application class, or passing "option" parameters into the document creation functions.

## Code
I've implemented another example from the book in this repo.  This example is a particularly lame text-based "maze" game.  I didn't create any UI or any good way to interact with the game, but there are functions built in for moving around the maze. You can see how the game is "played" at the bottom of each `.js` file:

```javascript
const game = new MazeGame();
const maze = game.createMaze();

game.getCurrentRoom();
game.tryDirection('north');
game.tryDirection('east');
game.tryDirection('south', 'open');
game.tryDirection('east', 'open');
game.tryDirection('east');
game.tryDirection('west');
```

### Creational Base
This is where most of the setup for the actual factory examples occurs. Classes are created for the `Maze` and `MazeGame` itself and the various elements you can encounter in the maze, `Room`s, `Wall`s, and `Door`s.

The interesting bit here, and the part that actually changes in the factory examples is `MazeGame.createMaze()`.  In this example it's fairly naive.  It simply grabs and instantiates the room, wall and door classes that we created and builds a simple 2-room maze:

```javascript
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
```

This is obviously quite inflexible because it hard-codes the classes right in the code. Adding new types of rooms, walls or doors will get messy _quick_... so using one of the factory patterns here will involve outsourcing the creation of those maze elements to methods.

### Abstract Factory
For the abstract factory, we create a new class called `MazeFactory` that creates these things for us, and then pass an instance of that class into `mazeGame.createMaze()`.  Creating variations of the elements inside the maze then is as easy as subclassing that MazeFactory and overwriting which ever methods you need to vary.

> note: the `abstract_factory` and `factory_method` files also import `creational_base.js`, so those files only redefine and subclass the elements that need to change to use the pattern.

```javascript
// the factories!
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

class FancyMazeFactory extends MazeFactory {
  makeRoom(id) {
    return new FancyRoom(id);
  }

  makeWall() {
    return new FancyWall();
  }
}

// using the factory in createMaze()
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
```

### Factory Method
The factory method example does the same thing as the Abstract Factory, except that instead of creating a completely new Factory class, it just sticks the creation methods inside the main mazeGame class. To use the variants then, all you need to do is subclass MazeGame and redefine the appropriate creation methods.

```javascript
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
```

## Conclusion
The basic idea here is simple: if you need variants of something in your code: move the creation of that thing to a factory function... doing that will allow you the flexibility you need to select variants on the fly.  Which of these patterns you use will depend on the circumstance and setup of the application you're working with.  The **Factory Method** is quite a bit simpler to set up, and you can get away without subclassing the application class if you use a function parameter to select your variant (`this.makeRoom(roomId, variant)`).

The **Abstract Factory** might be more flexible and easier to extend without cluttering up your main application class.

In either case, the basic idea is the same and is quite powerful! Personally, I'm interested in exploring ways to use this in front-end webdev where I am often tasked with creating variations (in style or behavior) on the same basic component, for example a pop-up dialog. I feel like I could come up with a pattern that makes creating variants of components or elements using factories relatively painless and easier to maintain in the long run. So: _thanks_ Gang of Four. `<3`