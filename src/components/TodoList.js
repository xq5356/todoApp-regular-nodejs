define([
	'{pro}/lib/regular.js',
	'{pro}/nej-Ajax.js'
	],function(_,nejAjax){

		var template ='\
			<section id="main">\
				<input type="checkbox" id="toggle-all" r-model={allCompleted}>\
				<label for="toggle-all">Mark all as complete</label>\
				<ul id="todo-list" >\
					{#list filteredTodos as todo}\
					<todo-item on-remove= {this.removeItem(todo_index)} item ={todo}></todo-item>\
					{/list}\
				</ul>\
			</section>\
			<footer id="footer">\
				<span id="todo-count"><strong>{activeLength}</strong>\
					{activeLength === 1 ?"item":"items"} left\
				</span>\
    			<ul id="filters">\
      				<li><a on-click={ currentSection="all" } class={currentSection === "all"?"selected":"" }>All</a></li>\
      				<li><a on-click={ currentSection="active" } class={currentSection === "active"?"selected":"" } >Active</a></li>\
      				<li><a on-click={ currentSection="completed" } class={currentSection === "completed"?"selected":"" }>Completed</a></li>\
     			</ul>\
      			<button on-click={ this.clearCompleted() } id="clear-completed">Clear completed({completedLength})\</button>\
    		</footer>\
		';

		var TodoList = Regular.extend({
			name:'todo-list',
			template:template,
			data:{
				currentSection:"all",
				todos:[]
			},
			computed:{
				activeLength:"this.getItems('active').length",
				completedLength:"this.getItems('completed').length",
				completedTodos:function(data){
					return data.todos.filter(function(todo){
						return !todo.isActive();
					});
				},

				filteredTodos:function(data){
					return this.getItems(data.currentSection);
				},

				allCompleted:{
					get:function(data){
						return !!this.getItems('completed').length &&this.getItems('completed').length ===data.todos.length;
					},
					set:function(value,data){
						if(data.todos) {
							data.todos.forEach(function(todo){
								todo.completed =value;
							});
						}
					}
				}
			},

			getItems:function(currentSection){
				var data =this.data;
				switch(currentSection) {
					case 'active':
					{
						return data.todos.filter(function(todo){
							return todo.isActive();
						});
					}

					case 'completed':
						{
							return data.todos.filter(function(todo){
								return !todo.isActive();
							});
						}
					default:
					{
						return data.todos;
					}
				}
			},

			removeItem:function(index){
				var item = this.data.todos.splice(index,1)[0];
				this.removeData(item,index);
			},

			clearCompleted:function(){
				var data = this.data;
				var self = this;

				this.getItems('completed').forEach(function(item){
					self.removeItem(data.todos.indexOf(item));
				});
			},

			removeData:function(item,originalIndex){
				var data =this.data;
				var self =this;
				var cachedRemoved = originalIndex ||0;

				nejAjax.request('/api/data',{
					data:{id:item.id},
					method:'delete'
				},function(err){
					if(err){
						data.todos.splice(originalIndex,0,cachedRemoved);
						self.$update();
					}
				});
			}
		});

		return TodoList;

	})