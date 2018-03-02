var PIXI = require("pixi.js");
var PixiApp = require("../entities/PixiApp");

class GameoverDisplay{
	constructor(){
		var winTexture = PixiApp.resources.winDisplay.texture;
		var loseTexture = PixiApp.resources.loseDisplay.texture;

		var sprite = new PIXI.Sprite();
		sprite.position.set(PixiApp.application.screen.width * 0.5, PixiApp.application.screen.height * 0.4)
		sprite.anchor.set(0.5, 0.5);
		sprite.scale.set(5,5);

		this.sprite = sprite;
		this.winTexture = winTexture;
		this.loseTexture = loseTexture;

		PixiApp.application.stage.addChild(sprite);
	}

	win(){
		this.sprite.visible = true;
		this.sprite.texture = this.winTexture;
	}

	lose(){
		this.sprite.visible = true;
		this.sprite.texture = this.loseTexture;
	}

	hide(){
		this.sprite.visible = false;
	}
}

module.exports = GameoverDisplay;
