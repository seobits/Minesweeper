const BoardSquare = require("./BoardSquare");
const PixiApp = require("./PixiApp");
const UIManager = require("../ui/UIManager");
const BoardInput = require("../BoardInput");

function isValidMatrixPosition(matrix, positionX, positionY) {
	var matrixLimitX = matrix[0].length;
	var matrixLimitY = matrix.length;
	if (positionX < 0 || positionX >= matrixLimitX || 
		positionY < 0 || positionY >= matrixLimitY){
		return false;
	}
	return true;
}

class GameBoard{
	constructor(nSquaresX, nSquaresY, nMines, maxWidth = 300, maxHeight = 300){
		const container = new PIXI.Container();
		container.parentClass = this;
		container.interactive = true;
		PixiApp.application.stage.addChild(container);
		
		this.input = BoardInput;
		this.container = container;
		this.isFirstTurn = true;
		this.isGameOver = false;
		this.maxWidth = maxWidth;
		this.maxHeight = maxHeight;
		this.canSeeBoard = false;

		this.generateBoard(nSquaresX, nSquaresY, nMines);
		this.shuffleMines(nMines);

		container.x = PixiApp.application.renderer.width * 0.5;
		container.y = PixiApp.application.renderer.height * 0.5;
		container.pivot.x = container.width * 0.5;
		container.pivot.y = container.height * 0.5;
	}

	shuffleMines(nMines, excludedPosition){
		const squares = this.squares;
		
		var availableSquares = [];
		var placedMines = 0;
		for(var y = 0; y < squares.length; y++){
			for(var x = 0; x < squares[0].length; x++){
				if(excludedPosition){
					if(excludedPosition.x == x && excludedPosition.y == y){
						continue;
					}
				}
				if(!squares[y][x].hasMine){
					availableSquares.push(squares[y][x]);
				}else{
					placedMines++;
				}
			}
		}
	
		for(var i = 0; i < availableSquares.length * 2; i++){
			const randomIndex = Math.floor(Math.random() * availableSquares.length);
			var temp = availableSquares[0];
			availableSquares[0] = availableSquares[randomIndex];
			availableSquares[randomIndex] = temp;
		}
	
		var totalMines = this.nMines - placedMines;
		for(var i = 0; i < totalMines; i++){
			availableSquares[i].hasMine = true;
		}
	}

	countSurroundingBombs(positionX, positionY){
		const matrix = this.squares;
		var totalBombs = 0;
		if(isValidMatrixPosition(matrix, positionX, positionY)){
			for(var ny = positionY - 1; ny <= positionY + 1; ny++){
				for(var nx = positionX - 1; nx <= positionX + 1; nx++){
					if(!(nx == positionX && ny == positionY)){
						if(isValidMatrixPosition(matrix, nx, ny)){
							var square = matrix[ny][nx];
							if(square.hasMine){
								totalBombs++;
							}	
						}
					}
				}
			}
		}
		return totalBombs;
	}

	clearFirstMove(positionX, positionY){
		var matrix = this.squares;
		if(isValidMatrixPosition(matrix, positionX, positionY)){
			for(var ny = positionY - 1; ny <= positionY + 1; ny++){
				for(var nx = positionX - 1; nx <= positionX + 1; nx++){
					if(isValidMatrixPosition(matrix, nx, ny)){
						var square = matrix[ny][nx];
						square.hasMine = false;
					}
				}
			}
		}
	}

	destroyBoard(){
		var squares = this.squares;
		for(var y = 0; y < squares.length; y++){
			for(var x = 0; x < squares[0].length; x++){
				squares[y][x].sprite.destroy();
				delete squares[y][x];
			}
		}
		this.squares = [];
		UIManager.uiElements.gameoverDisplay.hide();
	}

	generateBoard(width, height, nMines){
		var squares = [];

		this.placedFlags = 0;
		this.squareWidth = width;
		this.squareHeight = height;

		this.nMines = nMines >= width * height ? width * height : nMines;
		
		var squareWidth = this.maxWidth / width;
		var squareHeight = this.maxHeight / height;
		var squareSize = Math.min(squareWidth, squareHeight);
		for(var y = 0; y < this.squareWidth; y++){
			squares[y] = [];
			for(var x = 0; x < this.squareHeight; x++){
				var newBoardCell = new BoardSquare(x, y, squareSize, squareSize);
				this.container.addChild(newBoardCell.sprite);
				squares[y][x] = newBoardCell;
			}
		}
		this.squares = squares;
		BoardInput.initialize(this);
	}

	reset(){
		this.isFirstTurn = true;
		this.placedFlags = 0;
		this.canSeeBoard = false;
		for(var y = 0; y < this.squareWidth; y++){
			for(var x = 0; x < this.squareHeight; x++){
				var square = this.squares[x][y];
				square.reset();
			}
		}
		this.shuffleMines(this.nMines);
		this.input.activateInput(true);
		this.setFlags(0);
		UIManager.uiElements.gameoverDisplay.hide();
	}
	
	revealBoard(canSeeBoard){
		this.canSeeBoard = canSeeBoard;
		for(var y = 0; y < this.squares.length; y++){
			for(var x = 0; x < this.squares[0].length; x++){
				const currentSquare = this.squares[y][x];
				if(canSeeBoard){
					currentSquare.label.text = "";
					if(currentSquare.hasMine){
						currentSquare.addMine();
					}else{
						currentSquare.removeMine()
					}
				}else{
					currentSquare.close();
				}
			}	
		}
	}

	flagSquare(square){
		if(square.isFlagged()){
			this.placedFlags -= 1;	
			square.flag();
		}else{
			if(square.isClosed()){
				if(this.placedFlags < this.nMines){
					this.placedFlags += 1;
					square.flag();
				}
			}
			
		}
		
		this.setFlags(this.placedFlags);
	}

	setFlags(value){
		UIManager.uiElements.flagCounter.updateLabel(this.nMines - this.placedFlags);
		this.placedFlags = value;
	}

	//Recursive opening of squares
	openSquare(square){
		const positionX = square.data.column;
		const positionY = square.data.row;
		const matrix = this.squares;

		var mineCount = this.countSurroundingBombs(positionX, positionY);

		square.open(mineCount);
		if(mineCount <= 0){
			if(!square.hasMine){
				if(isValidMatrixPosition(matrix, positionX, positionY)){
					for(var ny = positionY - 1; ny <= positionY + 1; ny++){
						for(var nx = positionX - 1; nx <= positionX + 1; nx++){
							if(!(nx == positionX && ny == positionY)){
								if(isValidMatrixPosition(matrix, nx, ny)){
									var nextSquare = matrix[ny][nx];
									if(nextSquare.isClosed()){
										this.openSquare(nextSquare);
									}
								}
							}
						}
					}
				}
			}
		}
	}

	endGame(){
		this.isGameOver = true;
		this.revealBoard(true);
		this.input.activateInput(false);
	}

	win(){
		UIManager.uiElements.gameoverDisplay.win();
		this.endGame();
	}

	lose(){
		UIManager.uiElements.gameoverDisplay.lose();
		this.endGame();
	}

	checkVictoryStatus(){
		if(this.placedFlags == this.nMines){
			var squares = this.squares;
			var flaggedMines = 0;
			var openSquares = 0;
			for(var y = 0; y < squares.length; y++){
				for(var x = 0; x < squares[0].length; x++){
					var square = squares[y][x];
					if(square.isFlagged() && square.hasMine){
						flaggedMines++;
					}
					if(square.isOpen()){
						openSquares++;
					}
				}	
			}
			if(flaggedMines == this.nMines && openSquares + this.nMines == this.squareWidth * this.squareHeight){
				this.win();
			}
		}
	}

	dumpLevel(){
		var squares = this.squares;
		var levelDump = {}
		levelDump.mines = this.nMines;
		levelDump.width = this.squareWidth;
		levelDump.height = this.squareHeight;

		var dumpArray = [];
		for(var y = 0; y < squares.length; y++){
			dumpArray[y] = [];
			for(var x = 0; x < squares[0].length; x++){
				var square = squares[y][x];
				if(square.hasMine){
					dumpArray[y][x] = 1;
				}else{
					dumpArray[y][x] = 0;
				}
			}
		}
		levelDump.level = dumpArray;
		return levelDump;
	}

	loadLevel(data){
		var squares = this.squares;
		var nMines = 0;
		for(var y = 0; y < squares.length; y++){
			for(var x = 0; x < squares[0].length; x++){
				var dataSquare = data[y][x];
				if(dataSquare){
					squares[y][x].addMine();
					nMines++;
				}
			}	
		}
		this.nMines = nMines;
		this.setFlags(nMines);
	}
}

module.exports = GameBoard;