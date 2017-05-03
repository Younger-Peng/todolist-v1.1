import React, { Component } from 'react';
import './App.css';
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import * as localStore from './localStore'
import 'normalize.css'
import './reset.css'
// import AV from 'leancloud-storage'

// var APP_ID = 6djTrCTvHdHEdcIREHgGBIet-gzGzoHsz
// var APP_KEY = xcDIaORE7NRzamuuA0VWUX3r
// AV.init({
//   appId: APP_ID,
//   appKey: APP_KEY
// })

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      newTodo: '',
      todoList: localStore.load("todoList") || []
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
        <h1>我的待办</h1>
        <div>
          <TodoInput content={this.state.newTodo}
            onSubmit={this.addTodo.bind(this)}
            onChange={this.changeTitle.bind(this)} />
        </div>
        <ol className="todoList">
          {todos}
        </ol>
      </div>
    );
  }
  componentDidUpdate(){
    localStore.save('todoList',this.state.todoList)
  }
  addTodo(e){
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.newTodo='';
    stateCopy.todoList.push({
      id: idMaker(),
      title: e.target.value,
      status: null,
      deleted: false
    })

    this.setState(stateCopy)
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
    this.setState(stateCopy)
  }
  delete(e,todo){
    let index = this.state.todoList.indexOf(todo)
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    let todoCopy = JSON.parse(JSON.stringify(todo))
    todoCopy.deleted = true
    stateCopy.todoList[index] = todoCopy
    this.setState(stateCopy)   
  }
}

export default App;
let id = 0
function idMaker(){
  id += 1
  return id
}