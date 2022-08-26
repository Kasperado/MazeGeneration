// Config
const mazeSize = 20;
const canvasSize = 800;
const stepsPerSecond = 60;
const createInstantly = false;

// Data
const tileSize = canvasSize / mazeSize;
const grid = new Array(mazeSize).fill().map(e => new Array(mazeSize));
let allTiles = [];
let allWalls = [];  
let currentTile; // Tile that is currently being worked on
let visitedStack = []; // Stack of visited tiles

function setup() {
  // Set data
  createCanvas(canvasSize, canvasSize);
  textAlign(CENTER);
  // Create grid of tiles
  for (let x = 0; x < mazeSize; x++) {
    for (let y = 0; y < mazeSize; y++) {
      let tile = new Tile(x, y);
      grid[x][y] = tile;
      allTiles.push(tile);
    }
  }
  // Create walls
  for (let x = 0; x < mazeSize + 1; x++) {
    for (let y = 0; y < mazeSize + 1; y++) {
      // Horizontal
      if (x < mazeSize) {
        let wall = new Wall(x, y, true);
        allWalls.push(wall);
        // Check up and down for cells
        if (y-1 >= 0) {
          let upCell = grid[x][(y-1)];
          if (upCell) upCell.walls[2] = wall;
        }
        if (y < mazeSize) {
          let downCell = grid[x][y];
          if (downCell) downCell.walls[0] = wall;
        }
      }
      // Vertical
      if (y < mazeSize) {
        let wall = new Wall(x, y, false);
        allWalls.push(wall);
        // Check left and right for cells
        if (x-1 >= 0) {
          let leftCell = grid[(x-1)][y];
          if (leftCell) leftCell.walls[1] = wall;
        }
        if (x < mazeSize) {
          let rightCell = grid[x][y];
          if (rightCell) rightCell.walls[3] = wall;
        }
      }
    }
  }
  // DFS
  currentTile = grid[0][0];
  currentTile.visited = true;
  visitedStack.push(currentTile);
  if (createInstantly) while (visitedStack.length > 0) { randomDepthFirstSearch(); }
  // Speed of animation
  frameRate(stepsPerSecond);
}
// This is also update function
function draw() {
  // Draw tiles
  strokeWeight(0);
  for (let i = 0; i < allTiles.length; i++) { allTiles[i].draw(); }
  // Draw currentTile
  fill('yellow');
  if (currentTile) rect(currentTile.trueX, currentTile.trueY, tileSize, tileSize);
  // Draw walls
  strokeWeight(1);
  for (let i = 0; i < allWalls.length; i++) { allWalls[i].draw(); }
  // Draw text
  fill("red");
  for (let i = 0; i < visitedStack.length; i++) {
    const t = visitedStack[i];
    text(i, t.trueX + tileSize / 2, t.trueY  + tileSize / 2);
  }
  // DFS Tick
  if (visitedStack.length > 0) randomDepthFirstSearch();
}

function randomDepthFirstSearch() {
  // Check currentTile neighbors
  let candidates = []; 
  // Check left
  if (currentTile.x - 1 >= 0) {
    let neighbor = grid[currentTile.x - 1][currentTile.y];
    if (!neighbor.visited) candidates.push([3, neighbor]);
  }
  // Check right
  if (currentTile.x + 1 < mazeSize) {
    let neighbor = grid[currentTile.x + 1][currentTile.y];
    if (!neighbor.visited) candidates.push([1, neighbor]);
  }
  // Check up
  if (currentTile.y - 1 >= 0 ) {
    let neighbor = grid[currentTile.x][currentTile.y - 1];
    if (!neighbor.visited) candidates.push([0, neighbor]);
  }
  // Check down
  if ( currentTile.y + 1 < mazeSize) {
    let neighbor = grid[currentTile.x][currentTile.y + 1];
    if (!neighbor.visited) candidates.push([2, neighbor]);
  }
  // Are there any valid neighbors?
  if (candidates.length == 0) {
    currentTile.done = true; // currentTile is done
    visitedStack.pop(); // Remove done tile
    currentTile = visitedStack[visitedStack.length-1]; // Go back one tile
    return; // Break;
  }
  // Choose one of the neighbors
  let chosen = candidates[floor(random(0, candidates.length))];
  currentTile.walls[chosen[0]].isGap = true;
  currentTile = chosen[1];
  currentTile.visited = true;
  visitedStack.push(currentTile);
}

class Tile {

  x;
  y;
  walls = new Array(4);
  visited = false;
  done = false;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    fill(240);
    if (this.visited) fill("orange");
    if (this.done) fill("green");
    rect(this.trueX, this.trueY, tileSize, tileSize);
  }

  get trueX () { return this.x*tileSize }
  get trueY () { return this.y*tileSize }

}

class Wall {

  x;
  y;
  isHorizontal;
  isGap = false;

  constructor(x, y, h) {
    this.x = x;
    this.y = y;
    this.isHorizontal = h;
  }

  draw() {
    if (this.isGap) return;
    if (this.isHorizontal) rect(this.trueX, this.trueY, tileSize, 1);
    else rect(this.trueX, this.trueY, 1, tileSize);
  }

  get trueX () { return this.x*tileSize }
  get trueY () { return this.y*tileSize }

}