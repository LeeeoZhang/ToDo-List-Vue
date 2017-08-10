import Vue from 'vue'

var app = new Vue({
  el: '#app',
  data: {
    newTodo: '',
    todoList: []
  },
  created: function() {
  	window:onbeforeunload = () => {
  		let dataString = JSON.stringify(this.todoList)
  		window.localStorage.setItem('myTodos',dataString)
  	}
  	let oldDateString = window.localStorage.getItem('myTodos')
  	let oldDate = JSON.parse(oldDateString)
  	this.todoList = oldDate || []
  },
  methods: {
  	addTodo: function() {
  		this.todoList.push({
  			title: this.newTodo,
  			createdAt: new Date(),
  			done: false
  		})
  		this.newTodo = ''
  	},
  	removeTodo: function(todo) {
  		let index = this.todoList.indexOf(todo)
  		this.todoList.splice(index,1)
  	}
  }
})

