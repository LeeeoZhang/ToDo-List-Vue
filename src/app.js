import Vue from 'vue'
import AV from 'leancloud-storage'
import './index.css'
import './animate.css'

var APP_ID = 'OgPzbzD75egYLhe0Ku6Dt0Bp-gzGzoHsz'
var APP_KEY = 'UJtOPfEsIuo39HyQRV9nzM26'
AV.init({
    appId: APP_ID,
    appKey: APP_KEY,
})

var app = new Vue({
  el: '#app',
  data: {
	isActive: true,
    isIn: true,
	formData: {
		username: '',
		password: ''
	},
    newTodo: '',
    todoList: [],
    currentUser: null
  },
  created: function() {
    this.currentUser = this.getCurrentUser()
	  if(this.currentUser) {
		this.loadData()
	  }
  },
  methods: {
  	toggle: function(e) {
  		let target = e.target
		if(target.getAttribute('class','active')) {
  			return
		}
  		this.isActive = !this.isActive
	},
  	updateTodos: function() {
        let dataString = JSON.stringify(this.todoList)
		let avTodos = AV.Object.createWithoutData('AllTodos', this.todoList.id)
        avTodos.set('content', dataString)
		avTodos.save().then(() => {
        	console.log('更新成功')
		})
	},
	loadData: function() {
        var query = new AV.Query('AllTodos')
        query.find()
			.then((todos) => {
				let avAllTodos = todos[0]
				let id = avAllTodos.id
				this.todoList = JSON.parse(avAllTodos.attributes.content)
				this.todoList.id = id
			},function(error) {
				console.log(error)
			})
	},
  	addTodo: function() {
  		this.isIn = true
  		this.todoList.push({
  			title: this.newTodo,
  			createdAt: (new Date()).toDateString(),
  			done: false
  		})
  		this.newTodo = ''
		this.saveOrUpdate()
  	},
  	removeTodo: function(todo) {
  		this.isIn = false
  		let index = this.todoList.indexOf(todo)
  		this.todoList.splice(index,1)
		this.saveOrUpdate()
  	},
	signUp: function() {
		let user = new AV.User()
        user.setUsername(this.formData.username)
        user.setPassword(this.formData.password)
        user.signUp().then((loginedUser) => {
            this.currentUser = this.getCurrentUser()
        }, (error) => {
			alert('注册失败')
        })
	},
	saveTodo: function() {
        let dataString = JSON.stringify(this.todoList)
        var AVTodos = AV.Object.extend('AllTodos')
        var avTodos = new AVTodos()
        var acl = new AV.ACL();
        acl.setReadAccess(AV.User.current(),true);
        acl.setWriteAccess(AV.User.current(),true)
        avTodos.setACL(acl).set('content', dataString)
        avTodos.save().then((todo) => {
        	this.todoList.id = todo.id
            console.log('保存成功')
        },function(error) {
        	console.log('保存失败')
		})
	},
	saveOrUpdate: function() {
  		if(this.todoList.id) {
  			this.updateTodos()
		}else {
  			this.saveTodo()
		}
	},
	login: function() {
        AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
            this.currentUser = this.getCurrentUser()
  			this.loadData()
        }, function (error) {
        	alert('登陆失败')
        });
	},
  	getCurrentUser: function() {
  		let current = AV.User.current()
		if(current) {
            let {id, createdAt, attributes: {username}} = AV.User.current()
            return {id, createdAt, attributes: {username}}
        } else {
  			return null
		}
  	},
	logout: function() {
  		AV.User.logOut()
		this.currentUser = null
		window.location.reload()
	}
  }
})

