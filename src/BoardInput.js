var boardInput = {}
var gameBoard;
var isInputEnabled, isEditorEnabled;
var inputMode;

var selectedSquare;

const INPUT_MODE = {
	MINE: 0,
	FLAG: 1,
}

function addEventListeners(){
	if(PIXI.utils.isMobile.any){
		gameBoard.container.on("pointerdown", onSquareOpen);
	}else{
		gameBoard.container.on("mousedown", onSquareOpen);
		gameBoard.container.on("rightclick", onSquareFlag);
	}
	
	gameBoard.container.on("pointermove", (e) => {
		if(isEditorEnabled){
			if(e.target && selectedSquare){
				var newTarget = e.target.parentClass;
				if(newTarget && !newTarget.hasMine){
					selectedSquare.removeMine();
					newTarget.addMine();
					selectedSquare = newTarget;
				}
			}else if(!e.target){
				selectedSquare = null;
			}
		}
	})

	gameBoard.container.on("pointerup", (e) => {
		if(isEditorEnabled){
			if(e.target && selectedSquare){
				if(e.target.parentClass){
					selectedSquare = null;
				}
			}
		}
	})
}

function removeEventListeners(){
	if(PIXI.utils.isMobile.any){
		gameBoard.container.off("pointerdown", onSquareOpen);
	}else{
		gameBoard.container.off("mousedown", onSquareOpen);
		gameBoard.container.off("rightclick", onSquareFlag);
	}
}

function onSquareOpen(e){
	const square = e.target.parentClass;
	const board = e.currentTarget.parentClass;
	if(isInputEnabled){
		if(inputMode == INPUT_MODE.MINE){
			const positionX = square.data.column;
			const positionY = square.data.row;

			if(board.isFirstTurn){
				board.isFirstTurn = false;			
				square.removeMine();
				board.clearFirstMove(positionX, positionY);
				var mineCount = board.countSurroundingBombs(positionX, positionY);
				board.shuffleMines(mineCount, {x: positionX, y: positionY});
			}
	
			if(square.hasMine){
				board.lose();
			}

			board.openSquare(square);
		}else{
			board.flagSquare(square);
		}
	}
	
	if(isEditorEnabled){
		selectedSquare = square;
		if(!selectedSquare.hasMine){
			selectedSquare.addMine();
		}
	}
	
	board.checkVictoryStatus();
}

function onSquareFlag(e){
	const square = e.target.parentClass;
	const board = e.currentTarget.parentClass;
	if(isInputEnabled){
		board.flagSquare(square);
	}
	board.checkVictoryStatus();
}

boardInput.initialize = (board) =>{
	gameBoard = board;
	inputMode = INPUT_MODE.MINE;
	isInputEnabled = true;
	removeEventListeners();
	addEventListeners();
}

boardInput.activateInput = (isEnabled) => {
	isInputEnabled = isEnabled;
	isEditorEnabled = false;
}

boardInput.activateEditor = (isEnabled) => {
	isEditorEnabled = isEnabled;
	isInputEnabled = !isEnabled;
}

boardInput.flagMode = (isFlagMode) => {
	if(isFlagMode){
		inputMode = INPUT_MODE.FLAG;
		return;
	}
	inputMode = INPUT_MODE.MINE;
}


module.exports = boardInput;