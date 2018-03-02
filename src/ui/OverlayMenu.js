var DataSaver = require("../entities/DataSaver");

var overlay = {}
var inputs = {};
var buttons = {};

var overlayElement;
var gameBoard;
var levelDataSaver;

var isOverlayActive = false;
var canEditMines = false;

function toggleOverlayMenu(e){
	isOverlayActive = !isOverlayActive;
	var visibility = "hidden";
	var buttonText = "Show Options"
	if(isOverlayActive){
		visibility = "visible";
		buttonText = "Hide Options"
	}

	overlayElement.style.visibility = visibility;
	buttons.toggleOverlay.innerText = buttonText;
}

function extractFormElements(){
	overlayElement = document.getElementById("overlay-menu");

	var showOverlayButton = document.getElementById("toggle-overlay-button");
	buttons.toggleOverlay = showOverlayButton;

	var form = document.getElementById("form");
	for(var i = 0; i < form.length; i++){
		var currentElement = form[i];
		var elementName = currentElement.name;
		var tagName = currentElement.tagName.toLowerCase();
		var elementType = currentElement.type;

		if(elementName != ""){
			if(tagName == "input" || tagName == "select"){
				inputs[elementName] = currentElement;
			}else if(tagName == "button"){
				buttons[elementName] = currentElement;
			}
		}
	}
}

function fillData(width, height, mines){
	inputs.boardWidth.value = width;
	inputs.boardHeight.value = height;
	inputs.mines.value = mines;

	const selectElement = inputs.selectLevel;
	const levels = levelDataSaver.loadFromStorage();
	for(var key in levels){
		var newOption = document.createElement("option");
		newOption.innerText = key;
		selectElement.add(newOption);
	}
}

function addEventListeners(){
	buttons.toggleOverlay.addEventListener("pointerdown", toggleOverlayMenu);
	buttons.updateLevel.addEventListener("pointerdown", () => {
		var newWidth = inputs.boardWidth.value;
		var newHeight = inputs.boardHeight.value;
		var maxMines = newWidth * newHeight;
		var mines =Math.min(maxMines, inputs.mines.value);

		gameBoard.destroyBoard();
		gameBoard.generateBoard(newWidth, newHeight, mines);
		gameBoard.shuffleMines(mines);
		gameBoard.reset();
		gameBoard.revealBoard(canEditMines);
		gameBoard.input.activateEditor(canEditMines);

		inputs.mines.value = mines;
	})

	inputs.toggleMineEditor.addEventListener("change", (e) => {
		canEditMines = e.target.checked;
		gameBoard.revealBoard(canEditMines);
		gameBoard.input.activateEditor(canEditMines);
		gameBoard.setFlags(0);
	})

	inputs.toggleMineEditor.addEventListener("change", (e) => {
		canEditMines = e.target.checked;
		gameBoard.revealBoard(canEditMines);
		gameBoard.input.activateEditor(canEditMines);
		gameBoard.setFlags(0);
	})

	buttons.saveLevel.addEventListener("pointerdown", (e) => {
		var levelName = inputs.levelName.value;
		if(levelName.length > 0){
			var levelDump = gameBoard.dumpLevel();
			levelDataSaver.addField(levelName, levelDump, true);
			levelDataSaver.saveToStorage();
			
			var selectLevel = inputs.selectLevel;
			var isDuplicated = false;
			for(var i = 1; i < selectLevel.length; i++){
				var optionText = selectLevel[i].innerText;
				if(optionText == levelName){
					isDuplicated = true;
				}
			}

			if(!isDuplicated){
				var newOption = document.createElement("option");
				newOption.innerText = levelName;
				selectLevel.add(newOption);
			}
		}
	});

	buttons.loadLevel.addEventListener("pointerdown", (e) => {
		var selectLevel = inputs.selectLevel;
		var selectedIndex = selectLevel.selectedIndex;
		if(selectedIndex > 0){
			var valueOption = selectLevel[selectedIndex].innerText;
			var data = levelDataSaver.getField(valueOption);
			canEditMines = true;
			inputs.toggleMineEditor.checked = true;
			gameBoard.destroyBoard();
			gameBoard.generateBoard(data.width, data.height, 0);
			gameBoard.loadLevel(data.level);
			gameBoard.revealBoard(canEditMines);
			gameBoard.input.activateEditor(canEditMines);
		}
	})
}

overlay.initialize = (board) => {
	gameBoard = board;
	levelDataSaver = new DataSaver("levels");
	extractFormElements();
	fillData(gameBoard.squareWidth, gameBoard.squareHeight, gameBoard.nMines);
	addEventListeners();
}

overlay.buttons = buttons;

module.exports = overlay;