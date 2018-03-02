var PIXI = require("pixi.js");
var PixiApp = require("../entities/PixiApp");

class FlagCounter {
	constructor(width, height, initialValue = 0){
		const container = new PIXI.Container();

		const bgRect = new PIXI.Graphics();
		bgRect.beginFill(0xffffff);
		bgRect.drawRoundedRect(-width * 0.5, -height * 0.5, width, height, 5);
		bgRect.endFill();

		const icon = new PIXI.Sprite(PixiApp.resources.flagIcon.texture);
		const iconScale =  (width * 0.3) / icon.texture.orig.width;
		icon.scale.set(iconScale, iconScale);
		icon.anchor.set(0.5, 0.5);
		icon.x = width * -0.25;
		
		const label = new PIXI.extras.BitmapText(initialValue.toString(), {align: "center", tint: 0, font: "5px Pixeled"});
		const labelScale = (width * 0.5) / icon.texture.orig.width;
		label.scale.set(labelScale);
		label.anchor.set(0.5, 0.5);
		label.x = width * 0.15;

		container.addChild(bgRect);
		container.addChild(icon);
		container.addChild(label);
		
		this.label = label;
		this.container = container;
		this.container.parentClass = this;

		PixiApp.application.stage.addChild(container);
	}

	updateLabel(nFlags){
		this.label.text = nFlags.toString();
	}
}

module.exports = FlagCounter;