NEJ.define([],function(){

	function Todo(description,completed,id){
		if(typeof description !== "string"){
			throw new Error('the first argument must be string');
		}

		this.description = description;
		this.completed = completed ===undefined?false:completed;
		this.id =id ||0;
		this.idEditing = false;
		this._cachedDesc ="";
	}

	Todo.prototype.toggleCompleted =function(){
		this.completed =!this.completed;
	};

	Todo.prototype.isActive = function(){
		return !this.completed;
	};

	Todo.prototype.toggleEditing = function(cancel) {
		cancel = cancel||false;

		if(!this.isEditing){
			this._cachedDesc = this.description;
		}else if (!this.descriptin || cancel){
			this.description = this._cachedDesc;
		}
		this.isEditing = !this.isEditing;
	};

	return Todo;
})