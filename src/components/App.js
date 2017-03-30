define([
	'{pro}/lib/regular.js',
	'{pro}/components/Todo.js',
	'{pro}/nej-Ajax.js'],function(_,Todo,nejAjax){

		Regular.event('enter',function(element,fire){
			Regular.dom.on(element,'keypress',function(event){
				if(event.which === 13) fire(event);
			});
		});

		var template ='\
    		<header>\
        		<h1>TODOMVC</h1>\
        		<input type="text" id="new-todo" placeholder="What needs to be done?" on-enter = {this.addItem()} r-model = {newTodoDesc} >\
    		</header>\
      		<todo-list todos ={todos} ></todo-list>\
  		';

			var App = Regular.extend({
				name:'app',
				template:template,
				data:{
					todos:[],
					newTodoDesc:"",
				},
				init:function(){
					this.getData();
				},

				addItem:function(){
					var data = this.data;

					if(data.newTodoDesc){
						var item = new Todo(data.newTodoDesc);
						data.todos.unshift(item);
						this.addData(item);
						data.newTodoDesc ="";
					}

				},
				//往数据库中插入数据
				addData:function(item){
					var data = this.data;
					var self = this;

					nejAjax.request('/api/data',{
						data:item,
						method:'post'
					},function(err,res){
						if(err) {
							var i = data.todos.indexOf(item);
							if(i!== -1) data.todos.splice(i,1);
						}
						if(res && res.id){
							item.id = res.id;
						}
						self.$update();
					});
				},

				getData:function(){
					var data = this.data;
					var self = this;

					nejAjax.request('/api/data',{
						method:'get'
					},function(err,res){
						if(!err &&res){
							var d =res.data;
							data.todos = d.map(function(todo){
								return new Todo(todo.description,todo.completed,todo._id)
							});
							self.$update();
						}
					});
				}
			});
			return App;
	})