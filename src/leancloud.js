import AV from 'leancloud-storage'

var APP_ID = "6djTrCTvHdHEdcIREHgGBIet-gzGzoHsz";
var APP_KEY = "xcDIaORE7NRzamuuA0VWUX3r";
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})

export default AV

export function signIn(username,password,successFn,errorFn){
	AV.User.logIn(username,password).then(function(loginedUser){
		let user = getUserFromAVUser(loginedUser)
		successFn.call(null,user)
	}, function(error){
		errorFn.call(null,error)
	})
}

export function signUp(username,password,successFn,errorFn){
	//新建AVUser
	var user = new AV.User()
	//设置用户名
	user.setUsername(username)
	//设置密码
	user.setPassword(password)
	//然后注册
	user.signUp().then(function(loginedUser) {
		let user = getUserFromAVUser(loginedUser)//这时候的user还没有todolist属性
		successFn.call(null,user)
	}, function(error) {
		errorFn.call(null,error)
	})
	return undefined
}

export function getCurrentUser(){
	let user = AV.User.current()
	window.user = user
	if(user){
		return getUserFromAVUser(user)
	}else{
		return null
	}
}
export function downloadTodoList(user){
	console.log('user: ',user)
	let _this = this
	let stateCopy = JSON.parse(JSON.stringify(this.state))

		let todoListId = user.todoList
		console.log(111)
		var query = new AV.Query('TodoList')
		query.get(todoListId).then(function(todo) {
			stateCopy.user = user 
			stateCopy.todoList = todo.get('todoList');
			_this.setState(stateCopy);
		}, function(error){
			alert(error)
		})	



}
export function createTodoList(handler){ // 当用户第一次注册的时候创建TodoList的实例，并记住这个实例的Id,存到用户对象_User中
	let user = AV.User.current()
	var TodoList = AV.Object.extend('TodoList')
	var todoList = new TodoList()
	todoList.set('todoList',[])
	todoList.save().then(function(todo){
		window.todo = todo
			console.log('TodoList已经创建')
			handler.call(null,todo,user)
	}, function(error){
		alert(error)
	})
}
export function saveDataIdToUser(todo,user){
	let _this = this
	let User = AV.User.current()
	let stateCopy = JSON.parse(JSON.stringify(this.state))
	console.log('要设置user和数据的关系了')
	User.set('todoList',todo.id)
	User.save().then(function(loginedUser){
		let user = getUserFromAVUser(loginedUser)
		stateCopy.user = user
		_this.setState(stateCopy)
		console.log('用户的todoListId为: ',loginedUser.get('todoList'))//输出用户对象中的数据Id
	}, function(error){
		console.log(error)
	})
}

export function getTodoList(){

}
export function signOut(){
	AV.User.logOut()
	return undefined
}

function getUserFromAVUser(AVUser){
	return {
		id: AVUser.id,
		...AVUser.attributes
	}
}