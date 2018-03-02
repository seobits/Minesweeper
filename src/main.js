'use strict'

const PIXI = require('pixi.js');
const GameBoard = require("./entities/GameBoard");
const PixiApp = require("./entities/PixiApp");
const UIManager = require("./ui/UIManager");
const OverlayMenu = require("./ui/OverlayMenu");

function loadGame(){
	var appInstance = PixiApp.application;
	var texture = new PIXI.Texture(PixiApp.resources.bgtile.texture);
	
	var tilingTexture = new PIXI.extras.TilingSprite(texture, appInstance.screen.width, appInstance.screen.height);
	tilingTexture.scale.set(5, 5);
	appInstance.stage.addChild(tilingTexture);

	appInstance.ticker.add(() => {
		var step = 0.1 * appInstance.ticker.deltaTime;
		if(tilingTexture.tilePosition.x <= -tilingTexture.texture.orig.width){
			tilingTexture.tilePosition.x = tilingTexture.tilePosition.x % tilingTexture.texture.orig.width;
		}

		if(tilingTexture.tilePosition.y <= -tilingTexture.texture.orig.height){
			tilingTexture.tilePosition.y = tilingTexture.tilePosition.y % tilingTexture.texture.orig.height;
		}

		tilingTexture.tilePosition.x -= step;
		tilingTexture.tilePosition.y -= step;
	})

	
	const mines = 10;
	const boardWidth = 9;
	const boardHeight = 9;

	var gameBoard = new GameBoard(boardWidth, boardHeight, mines, appInstance.view.width, appInstance.view.height * 0.7);
	OverlayMenu.initialize(gameBoard);
	UIManager.initialize();

	var flagCounter = UIManager.uiElements.flagCounter;
	flagCounter.container.position.set(gameBoard.container.x - gameBoard.container.width * 0.5 + flagCounter.container.width * 0.5, gameBoard.container.y - (gameBoard.container.height * 0.5) - flagCounter.container.height);
	flagCounter.updateLabel(mines);

	const resetButton = UIManager.uiElements.resetButton;
	resetButton.container.position.set(appInstance.screen.width * 0.5, gameBoard.container.y - (gameBoard.container.height * 0.5) - resetButton.container.height);
	resetButton.onClick((e) => {
		gameBoard.reset();
		//gameBoard.revealBoard(gameBoard.canSeeBoard);
		gameBoard.input.activateEditor(gameBoard.canSeeBoard);
	});

	const changeModeIcon = UIManager.uiElements.changeModeIcon;
	var flagMode = false;
	changeModeIcon.container.position.set(gameBoard.container.x + gameBoard.container.width * 0.5 - changeModeIcon.container.width * 0.5, gameBoard.container.y - (gameBoard.container.height * 0.5) - changeModeIcon.container.height);
	changeModeIcon.onClick((e) => {
		flagMode = !flagMode;
		var texture = PixiApp.resources.digModeIcon.texture;
		if(flagMode){
			texture = PixiApp.resources.flagModeIcon.texture;
		}
		changeModeIcon.icon.texture = texture;
		gameBoard.input.flagMode(flagMode);
	});
}

var pixiApp = new PixiApp();
pixiApp.loadResources(loadGame);
