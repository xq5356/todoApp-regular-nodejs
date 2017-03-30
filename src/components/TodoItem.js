define([
	'{pro}/lib/regular.js',
	'{pro}/nej-Ajax.js',
	'{pro}/lib/nej/base/global.js'
	],function(_,nejAjax,NEJ){

		var template ='\
			<li r-class={ {"completed":item.completed,"editing":item.isEditing}}>\
				<div class="view">\
					<input type="checkbox" class="toggle" r-model={item.completed}>\
					<label on-dblclick={item.isEditing = true}>{item.description}</label>\
					<button on-click ={this.remove()} class="destroy"></button>\
				</div>\
				<input id="edit" class="edit" on-enter={item.isEditing =false} r-model = {item.description} autofocus >\
			</li>\
		';

		var TodoItem = Regular.extend({
			name:'todo-item',
			template:template,
			data:{
				cachedItem:null
			},

			remove:function(){
				this.$emit("remove");
			},

			init:function(){
				var data = this.data;

				this.$watch('item.isEditing',function(newVal,oldVal){
					if(newVal &&!oldVal) {
						data.cachedItem = NEJ.copy({},data.item);
						this.$update();
					}else if(!newVal &&oldVal){
						this.updateData(data.item);
					}
				});
				this.$watch('item.completed',function(newVal,oldVal){
					data.cachedItem = NEJ.copy({},data.item);
					data.cachedItem.completed = oldVal;

					this.$update();
					this.updateData(data.item);
				});
			},

			updateData:function(item){
				var data = this.data;
				var self = this;

				if(item.id) {
					nejAjax.request('/api/data',{
						data:item,
						method:'put'
					},function(err){
						if(err){
							data.item = data.cachedItem;
						}
						self.$update();
					});
				}
			}
		});

		return TodoItem;
	})