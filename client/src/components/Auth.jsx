import Axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

import styles from "../styles/authCreate.module.css";

const baseURL = require('../modules/conf');

async function sha256(plainPassword){
	const data  = new TextEncoder().encode(plainPassword);
	const digest = await crypto.subtle.digest('SHA-256', data);
	return Array.from(new Uint8Array(digest)).map(h => h.toString(16).padStart(2,'0')).join('');
}

function Auth() {

	// initialize
	const [formVal, setFormVal] = useState({
		userID: '',
		password: ''
	});

	// cookie
	const [userIDVal, setUserIDVal] = useState("");
	let [passwordVal, setPasswordVal] = useState("");
	const [cookies, setCookie, removeCookie] = useCookies(["userID", "password"]);
	const [attention, setAttention] = useState("");

	const inputChg = async (event) => {
		const {name, value} = event.target;
		setFormVal({...formVal, [name]: value});
		if (name === 'userID') {
			setPasswordVal(value);
		} else if (name === 'password') {
			setPasswordVal(value);
		} else {
			console.log('error');
		}
	}

	const navigate = useNavigate();

	const submit = async (event) => {
		event.preventDefault();
		removeCookie("userID");
		removeCookie("password");
		formVal.password = await sha256(passwordVal);
		Axios.post(baseURL, formVal)
		.then((response) => {
			if(response.data.status === 'success') {
				setCookie("userID", formVal.userID);
				setCookie("password", formVal.password);
				navigate("/timeline");
			} else {
				formVal.password = passwordVal;
				setAttention('ユーザIDもしくはパスワードが誤っています');
			}
		})
		.catch(error => {
			console.log('error');
		})
	}
	return (
		<div className={styles.page}>
			<form onSubmit={submit}>
				<div className={styles.formWrapper}>
					<label>ユーザID</label>
					<input 
						type="text" 
						name="userID" 
						value={formVal.userID}
						onChange={inputChg}
						placeholder="英数字" 
						inputMode="numeric"
						pattern="^[a-zA-Z0-9_]+$"
						required />
				</div>
				<div className={styles.formWrapper}>
					<label>パスワード</label>
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
				<div className={styles.submit}>
					<button type="submit" className={styles.authCreate}>ログイン</button>
				</div>
			</form>
			<p>{attention}</p>
			<div className={styles.center}>
				<Link to={'/usercreate/'} className={styles.registration}>ユーザ登録</Link>
			</div>
		</div>

	)
}

export default Auth;