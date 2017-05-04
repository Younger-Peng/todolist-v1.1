import React, {Component} from 'react'
import './UserDialog.css'
import AV from 'leancloud-storage'
import {signUp, signIn, saveDataIdToUser} from './leancloud'

export default class UserDialog extends Component {
	constructor(props){
		super(props)
		this.state={
			selected: 'signUp',
			formData: {
				username: '',
				password: ''
			}
		}
	}
	switch(e){
		this.setState({
			selected: e.target.value
		})
	}
	signUp(e){
		e.preventDefault()
		let {username,password} = this.state.formData
		if(username === ''){
			alert('请输入有效的用户名')
			return
		}
		else if(password === ''){
			alert('请输入有效的密码')
			return
		}

		let success = (user)=>{
			console.log(user)
			this.props.onSignUp.call(null,user)
		}
		let error = (error)=>{
			switch(error.code){
				case 201:
					alert('密码不能为空')
					break
				case 202:
				  alert('用户名已被占用')
				  break
				case 217:
					alert('用户名不能为空格')
					break
				case 218:
					alert('密码不能为空')
					break
				default:
					alert(error)
					break
			}
		}
		signUp(username,password,success,error)
	}
	signIn(e){
		e.preventDefault()  //如果这一步不阻止默认事件的话
		let success = (user)=>{
			console.log(user.id)
			this.props.onSignIn.call(null,user)
		}
		let error = (error)=>{
			alert(error.code)
			switch(error.code){
				case 210:
					alert('用户名与密码不匹配')
					break
				case 211:
					alert('找不到用户')
					break
			  default:
			  	alert(error)
			  break
			}
		}
		let {username,password} = this.state.formData
		signIn(username,password,success,error)
	}
	changeFormData(key,e){
		let stateCopy = JSON.parse(JSON.stringify(this.state))
		stateCopy.formData[key] = e.target.value
		this.setState(stateCopy)
	}


	render(){
		let signUpForm = (
			<form className="signUp" onSubmit={this.signUp.bind(this)}> {/* 注册*/}
				<div className="row">
					<label>用户名</label>
					<input type="text" placeholder="输入用户名"
					 value={this.state.formData.username}
					 onChange={this.changeFormData.bind(this,'username')} />
				</div>
				<div className="row">
					<label>密码</label>
					<input type="password" placeholder="输入密码"
					 value={this.state.formData.password}
					 onChange={this.changeFormData.bind(this,'password')} />
				</div>
				<div className="row actions">
					<button type="submit">注册</button>
				</div>
			</form>
		)
		let signInForm = (
			<form className="signIn" onSubmit={this.signIn.bind(this)}> {/* 登录*/}
				<div className="row">
					<label>用户名</label>
					<input type="text" placeholder="输入用户名"
					 value={this.state.formData.username}
					 onChange={this.changeFormData.bind(this,'username')} />
				</div>
				<div className="row">
					<label>密码</label>
					<input type="password" placeholder="输入密码"
					 value={this.state.formData.password}
					 onChange={this.changeFormData.bind(this,'password')} />
				</div>
				<div className="row actions">
					<button type="submit">登录</button>
				</div>
			</form>
		)
		return (
			<div className="UserDialog-Wrapper">
				<div className="UserDialog">
					<nav>
						<label><input type="radio" value='signUp'
						  onChange={this.switch.bind(this)} 
						 checked={this.state.selected === 'signUp'} /> 注册</label>
						<label><input type="radio" value='signIn'
						  onChange={this.switch.bind(this)}
						 checked={this.state.selected === 'signIn'} /> 登录</label>
					</nav>
					<div className="panes">
						{this.state.selected === 'signUp' ? signUpForm : null}
						{this.state.selected === 'signIn' ? signInForm : null}
					</div>
				</div>
			</div>
		)
	}
	
}