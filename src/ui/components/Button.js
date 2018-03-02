const PIXI = require("pixi.js");
const PixiApp = require("../../entities/PixiApp");
const defaultOptions = {
	backgroundColor: 0,
	icon: null,
	radius: 0,
	onPress: null,
}

class IconButton{
	constructor(x, y, width, height, options){
		options = options || defaultOptions;

		const container = new PIXI.Container();
		PixiApp.application.stage.addChild(container);
		
		const rectGraphic = new PIXI.Graphics();
		rectGraphic.beginFill(options.backgroundColor || defaultOptions.backgroundColor);
		//rectGraphic.lineStyle(3, 0x0)
		rectGraphic.drawRoundedRect(-width * 0.5, -height * 0.5, width, height, options.radius || defaultOptions.radius);
		rectGraphic.endFill();
		container.addChild(rectGraphic);

		var spriteIcon;
		if(options.icon){
			const scale = (width / options.icon.orig.width) * 0.9;
			spriteIcon = new PIXI.Sprite();
			spriteIcon.anchor.set(0.5, 0.5);
			spriteIcon.scale.set(scale, scale);
			spriteIcon.texture = options.icon;
			container.addChild(spriteIcon);
		}

		this.onClick(options.onPress || defaultOptions.onPress);

		this.container = container;
		this.icon = spriteIcon;
		this.container.parentClass = this;
	}

	onClick(callback){
		if(typeof(callback) == "function"){
			this.container.interactive = true;
			this.container.buttonMode = true;
			this.container.on("pointerdown", callback);
			this.onPress = callback;
		}
	}
}

module.exports = IconButton;