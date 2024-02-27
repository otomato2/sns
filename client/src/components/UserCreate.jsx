import Axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import styles from "../styles/authCreate.module.css";
const baseURL = require('../modules/conf');

async function sha256(plainPassword){
	const data  = new TextEncoder().encode(plainPassword);
	const digest = await crypto.subtle.digest('SHA-256', data);
	return Array.from(new Uint8Array(digest)).map(h => h.toString(16).padStart(2,'0')).join('');
}

function UserCreate() {

	// init date
	const today = new Date();
	const year = today.getFullYear();
	let month = today.getMonth() + 1;
	let date = today.getDate();

	if (month <= 9) {
		month = '0' + String(month);
	}
	if (date <= 9) {
		date = '0' + String(date);
	}

	const [formVal, setFormVal] = useState({
		userID: '',
		userName: '',
		password: '',
		passwordConfirm: '',
		birthday: `${year - 18}-${month}-${date}`,
		bio: ''
	})

	const [cookies, setCookie, removeCookie] = useCookies(["userID", "password"]);

	const [userIDVal, setUserIDVal] = useState("");
	const [passwordVal, setPasswordVal] = useState("");
	const [passwordConfirmVal, setPasswordConfirmVal] = useState("");
	const [attention, setAttention] = useState("");

	const inputChg = async (event) => {
		const {name, value} = event.target;
		setFormVal({...formVal, [name]: value});
		if (name === 'userID') {
			setUserIDVal(value);
		} else if (name === 'password') {
			setPasswordVal(value);
		} else if (name === 'passwordConfirm') {
			setPasswordConfirmVal(value);
		}
	}

	const navigate = useNavigate();

	const submit = async (event) => {
		event.preventDefault();
		if (passwordVal !== passwordConfirmVal) {
			setAttention('パスワードが一致しません');
		} else {
			formVal.password = await sha256(passwordVal);
			Axios.post(baseURL + '/usercreate/', formVal)
			.then((response) => {
				if(response.data.status === 'success') {
					setCookie("userID", userIDVal);
					setCookie("password", passwordVal);
					navigate("/timeline");
				} else {
					formVal.password = passwordVal;
					setAttention('このIDは利用されています');
				}
			})
			.catch(error => {
				console.log('error');
			})
		}		
	}

	return (
		<div className={styles.page}>
			<div className={styles.center}><Link to={'/terms'} className={styles.registration}>ご利用に際して</Link></div>
			<div className={styles.attention}><p>必ずお読みください．アカウントを作成した時点ですべての事項に同意したものとみなします</p></div>
			<form onSubmit={submit}>
				<div className={styles.formWrapper}>
					<label>ユーザID ＜必須＞</label>
					<input 
						type="text" 
						name="userID" 
						value={formVal.userID}
						onChange={inputChg}
						placeholder="小文字，数字，「_」" 
						inputMode="numeric"
						pattern="^[a-z0-9_]+$"
						required />
				</div>
				<div className={styles.formWrapper}>
					<label>ユーザ名 ＜必須＞</label>
					<input 
						type="text" 
						name="userName" 
						value={formVal.userName} 
						onChange={inputChg}
						placeholder=""
						required />
				</div>
				<div className={styles.formWrapper}>
					<label>パスワード ＜必須＞</label>
					<input 
						type="password" 
						name="password" 
						value={formVal.password} 
						onChange={inputChg}
						placeholder="英数字 (8~32字)"
						minLength={8}
						maxLength={32}
						required />
				</div>
				<div className={styles.formWrapper}>
					<label>パスワード (確認) ＜必須＞</label>
					<input 
						type="password" 
						name="passwordConfirm" 
						value={formVal.passwordConfirm} 
						onChange={inputChg}
						placeholder="英数字 (8~32字)"
						minLength={8}
						maxLength={32}
						required />
				</div>
				<div className={styles.formWrapper}>
					<label>誕生日</label>
					<input 
						type="date" 
						name="birthday" 
						value={formVal.birthday} 
						onChange={inputChg}
						max={`${year}-${month}-${date}`} />
				</div>
				<div className={styles.formWrapper}>
					<label>自己紹介文</label>
					<input 
						type="text" 
						name="bio" 
						value={formVal.bio}
						onChange={inputChg}
						placeholder="" />
				</div>
				<div>
					<button type="submit" className={styles.authCreate}>アカウント作成</button>
				</div>
			</form>
			<p>{attention}</p>
		</div>
	)
}
export default UserCreate;