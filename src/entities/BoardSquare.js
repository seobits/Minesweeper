'use strict'
const PixiApp = require("./PixiApp");
const STATES = {
	closed: 1,
	open: 2,
	flagged: 3,
}

class BoardSquare{
	static get STATES(){
		return STATES;
	}

	constructor(x, y, width, height){

		var square = new PIXI.Sprite(PixiApp.resources.closed.texture);
		square.parentClass = this;
		square.interactive = true;
		square.buttonMode = true;

		var fitScale = width / square.texture.orig.width;
		square.x = x * width;
		square.y = y * height;
		square.scale.set(fitScale, fitScale);

		var labelMine = new PIXI.extras.BitmapText("", {font: "8px Pixeled"});
		labelMine.anchor.set(0.5, 0.5);
		labelMine.x = (square.texture.orig.width * 0.45);
		labelMine.y = (square.texture.orig.width * 0.45);
		square.addChild(labelMine);

		this.minesAround = 0;
		this.sprite = square;
		this.label = labelMine;
		this.state = STATES.closed;
		this.data = {
			column: x,
			row: y,
		}
		this.hasMine = false;
	}

	reset(){
		this.close();
		this.hasMine = false;
		this.minesAround = 0;
		this.label.text = "";
	}

	isClosed(){
		return this.state == STATES.closed;
	}

	isOpen(){
		return this.state == STATES.open;
	}

	isFlagged(){
		return this.state == STATES.flagged;
	}

	open(nMines){
		if(this.state == STATES.closed){
			this.state = STATES.open;
			if(this.hasMine){
				this.sprite.texture = PixiApp.resources.mine.texture;
			}else{
				this.sprite.texture = PixiApp.resources.empty.texture;
				this.minesAround = nMines;
				this.updateLabel(nMines);
			}
		}
	}

	flag(){
		if(this.state == STATES.closed){
			this.state = STATES.flagged;
			this.sprite.texture = PixiApp.resources.flag.texture;
			return;
		}else if(this.state == STATES.flagged){
			this.close();
		}
	}

	close(){
		this.state = STATES.closed;
		this.sprite.texture = PixiApp.resources.closed.texture;
	}
	
	removeMine(){
		this.hasMine = false;
		this.sprite.texture = PixiApp.resources.empty.texture;
	}

	addMine(){
		this.hasMine = true;
		this.sprite.texture = PixiApp.resources.mine.texture;
	}

	updateLabel(value){
		this.minesAround = value;
		if(value > 0){
			this.label.text = value;
		}else{
			this.label.text = "";
		}
	}
}

module.exports = BoardSquare;