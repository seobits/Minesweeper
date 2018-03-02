
class DataSaver{
	constructor(dataName){
		if(typeof(dataName) == "string"){
			this.dataName = dataName || "DataSaver";
			this.data = {};
		}
	}

	getField(fieldName){
		if(this.data[fieldName]){
			return this.data[fieldName];
		}
	}

	addField(fieldName, data, canOverwrite){
		if(fieldName.length > 0){
			this.data[fieldName] = data;
		}
	}

	removeField(fieldName){
		if(this.data[fieldName]){
			delete this.data[fileName];
		};
	}

	wipeStorage(){
		localStorage.removeItem(this.dataName);
	}

	saveToStorage(){
		var jsonString = JSON.stringify(this.data);
		localStorage.setItem(this.dataName, jsonString);
	}

	loadFromStorage(){
		var jsonString = localStorage.getItem(this.dataName);
		if(jsonString != null){
			this.data = JSON.parse(jsonString);
			
		}else{
			this.data = {};
		}
		
		return this.data;
	}
}

module.exports = DataSaver;