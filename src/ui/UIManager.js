var IconButton = require("./components/Button");
var FlagCounter = require("./FlagCounter");
var GameoverDisplay = require("./GameoverDisplay");
var PixiApp = require("../entities/PixiApp");

var UIManager = {}
UIManager.uiElements = {}
UIManager.initialize = () => {
	const pixiApplication = PixiApp.application;

	const flagCounterWidth = pixiApplication.screen.height * 0.14;
	const flagCounter = new FlagCounter(flagCounterWidth, flagCounterWidth * 0.5, 0);
	UIManager.uiElements.flagCounter = flagCounter;

	var resetButton = new IconButton(0, 0, pixiApplication.screen.height * 0.07, pixiApplication.screen.height * 0.07, {
		backgroundColor: 0xffffff,
		icon: PixiApp.resources.resetButton.texture,
		radius: 10,
	})
	UIManager.uiElements.resetButton = resetButton;

	var changeModeIcon = new IconButton(0, 0, pixiApplication.screen.height * 0.07, pixiApplication.screen.height * 0.07, {
		backgroundColor: 0xffffff,
		icon: PixiApp.resources.digModeIcon.texture,
		radius: 10,
	})
	UIManager.uiElements.changeModeIcon = changeModeIcon;

	var gameoverDisplay = new GameoverDisplay();
	UIManager.uiElements.gameoverDisplay = gameoverDisplay;
}

module.exports = UIManager;