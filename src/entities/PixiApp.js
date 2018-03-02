const PIXI = require("pixi.js");
const resourceList = require("../data/resources");

var application;
var resources = {};

class PixiApp{
	static get application(){
		return application;
	}

	static get resources(){
		return resources;
	}

	constructor(){
		this.initialize();
	}

	initialize(){
		application = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor: 0xffffff, transparent: false});
		application.view.addEventListener("contextmenu", (e) => {
			e.preventDefault();
		})
		application.stage.defaultCursor = "url(./img/bgtile.png) 3 2, auto";
		document.body.append(application.view)
		PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
	}

	loadResources(onLoad){
		var resourceLoader = new PIXI.loaders.Loader();
		for(var keyGroup in resourceList){
			for(var key in resourceList[keyGroup]){
				resourceLoader.add(key, resourceList[keyGroup][key]);
			}
		}

		resourceLoader.load((loader, res) => {
			for(var key in res){
				resources[key] = res[key];
			}
			if(typeof(onLoad) == "function"){
				onLoad();
			}
		});
	}
}

module.exports = PixiApp;