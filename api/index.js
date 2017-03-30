const express = require('express');
const TodoModel = require('./todoModel.js');

const router =express.Router();

router.get('/data',function(req,res,next){
	TodoModel.find({},function(err,todos){
		if(err) {
			console.log(err);
			return next({
				message:'Server error'
			});
		}
		var resJson ;
		if(todos) {
			res.status(200);
			resJson = {
				message:'OK',
				data:todos
			};
		}else {
			res.status(404);
			resJson ={
				message:"No data"
			};
		}
		return res.json(resJson);
	})
});

router.post('/data',function(req,res,next){
	var data = req.body;
	if(data.description) {
		TodoModel.create({
			description:data.description,
			completed:Boolean(data.completed)
		},function(err,todo){
			if(err){
				console.log(err);
				return next({
					message:'server error'
				});
			}

			res.status(200);
			return res.json({
				message:'Ok',
				id:todo._id
			});
		});
	}else {
		res.status(403);
		return res.json({
			message:'Ivalid data'
		});
	}

});

router.delete('/data',function(req,res,next){
	var id = req.body.id ||req.query.id;

	if(id){
		TodoModel.findByIdAndRemove(id,function(err){
			if(err){
				console.log(err);
				return next({
					message:'Server error'
				});
			}
			res.status(200);
			return res.json({
				message:'Ok'
			});
		});
	}else {
		res.status(403);
		return res.json({
			message:'Invalid data'
		});
	}
});

router.put('/data',function(req,res,next){
	var id =req.body.id || req.query.id;
	var data =req.body;

	!data.description?data.description=req.query.description:0;
	data.completed===undefined?data.completed=req.query.completed:0

	if(id){
		TodoModel.findById(id,function(err,todo){
			if(err){
				console.log(err);
				return next({
					message:'server error'
				});
			}

			if(data.description !== todo.description || data.completed!==todo.completed){
				todo.completed =todo.completed===data.completed||data.completed ===undefined?todo.completed:data.completed;
				todo.description=todo.description===data.description||!data.description?todo.description:data.description;

				todo.save(function(err){
					if(err){
						console.log(err);
						return next({
							message:'server error'
						});
					}

					res.status(200);
					return res.json({
						message:'Ok'
					});
				});
			}else {
				res.status(200);
				return res.json({
					message:'OK'
				});
			}
		});
	}else {
		res.status(403);
		return res.json({
			message:'Ivalid data'
		});
	}

});

module.exports = router;