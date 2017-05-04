import React, { Component } from 'react';
import './App.css';
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import 'normalize.css'
import './reset.css'
import AV from './leancloud'
import UserDialog from './UserDialog'
import {getCurrentUser, signOut, createTodoList, saveDataIdToUser, downloadTodoList} from './leancloud'
// var TodoFolder = AV.Object.extend("TodoFolder")
// var todoFolder = new TodoFolder()


class App extends Component {
  constructor(props){
    super(props)
    this.state={
      user: getCurrentUser() || {},
      newTodo: '',
      todoList: []
    }
  }
  render() {
    let todos = this.state.todoList
      .filter((item)=> !item.deleted)
      .map((item,index)=>{
      return (
        <li key={index} className>
          <TodoItem todo={item} onToggle={this.toggle.bind(this)}
            onDelete={this.delete.bind(this)} />
        </li>
      )
    })
    return (
      <div className="App">
        <h1>{this.state.user.username||'我'}的待办
        {this.state.user.id ? <button onClick={this.onSignOut.bind(this)}>登出</button> : null}</h1>
        <div>
          <TodoInput content={this.state.newTodo}
            onSubmit={this.addTodo.bind(this)}
            onChange={this.changeTitle.bind(this)} />
        </div>
        <ol className="todoList">
          {todos}
        </ol>
        {this.state.user.id ? null : <UserDialog onSignUp={this.onSignUp.bind(this)}
          onSignIn={this.onSignIn.bind(this)} />}
      </div>
    );
  }
  componentWillMount(){
    let user = this.state.user
    let hasProp = false
    for(let key in user){
      hasProp = true
    }
    if(hasProp){
      downloadTodoList.call(this,user)
    }else {
      return
    }
  }
  componentDidUpdate(){
    
  }
  onSignIn(user){
    downloadTodoList.call(this,user)
  }
  onSignUp(user){
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = user
    createTodoList.call(null,saveDataIdToUser.bind(this))
    // this.setState(stateCopy) 等todoListId存在user之后，再setState
  }
  onSignOut(e){
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = ''
    stateCopy.todoList = []
    signOut.call(null)
    this.setState(stateCopy)
  }
  addTodo(e){
    let _this = this
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.newTodo='';
    stateCopy.todoList.push({
      id: idMaker(),
      title: e.target.value,
      status: null,
      deleted: false
    })
    this.saveToCloud.call(this,stateCopy)
  }
  saveToCloud(data){
    let _this = this
    let todoListId = this.state.user.todoList
      var todo = new AV.Object.createWithoutData('TodoList',todoListId)
      todo.set('todoList',data.todoList)
      todo.save().then(function(todo){
        _this.setState(data)
      })
  }
  changeTitle(e){
    this.setState({
      newTodo: e.target.value,
      todoList: this.state.todoList
    })
  }
  toggle(e,todo,item){
    let index = this.state.todoList.indexOf(todo)
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    let todoCopy = JSON.parse(JSON.stringify(todo))
    todoCopy.status = todo.status === 'completed' ? '' : 'completed'
    stateCopy.todoList[index] = todoCopy
    this.saveToCloud.call(this,stateCopy)
  }
  delete(e,todo){
    let index = this.state.todoList.indexOf(todo)
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    let todoCopy = JSON.parse(JSON.stringify(todo))
    todoCopy.deleted = true
    stateCopy.todoList[index] = todoCopy
    this.saveToCloud.call(this,stateCopy)
  }
}

export default App;
let id = 0
function idMaker(){
  id += 1
  return id
}