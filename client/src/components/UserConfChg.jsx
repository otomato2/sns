import Axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Navi from "./Navi";
import UserDelete from "./UserDelete";

import styles from "../styles/authCreate.module.css";
import pageStyle from "../styles/page.module.css";
const baseURL = require('../modules/conf');

async function sha256(plainPassword){
	const data  = new TextEncoder().encode(plainPassword);
	const digest = await crypto.subtle.digest('SHA-256', data);
	return Array.from(new Uint8Array(digest)).map(h => h.toString(16).padStart(2,'0')).join('');
}

function UserConfChg() {

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

	const [cookies, setCookie, removeCookie] = useCookies(["userID", "password"]);

	const [formVal, setFormVal] = useState({
		userID: '',
		userName: '',
		password: '',
		passwordConfirm: '',
		birthday: '',
		bio: ''
	})

	const [passwordVal, setPasswordVal] = useState("");
	const [userIDChgStatus, setUserIDChgStatus] = useState("");
	const [userNameChgStatus, setUserNameChgStatus] = useState("");
	const [passwordChgStatus, setPasswordChgStatus] = useState("");
	const [passwordConfirmVal, setPasswordConfirmVal] = useState("");
	const [bioChgStatus, setBioChgStatus] = useState("");

	const inputChg = async (event) => {
		const {name, value} = event.target;
		setFormVal({...formVal, [name]: value});
		if (name === 'password') {
			setPasswordVal(value);
		} else if (name === 'passwordConfirm') {
			setPasswordConfirmVal(value);
		}
	}

	const navigate = useNavigate();

	const submitUserID = (event) => {
		event.preventDefault();
		if (formVal.userID == "") {
			setUserIDChgStatus('文字を入力してください');
		} else {
			const req = {userID: cookies.userID, chgUserID: formVal.userID};
			Axios.post(baseURL + '/userconfchg/userid/', req)
			.then((response) => {
				if(response.data.status === 'success') {
					removeCookie("userID");
					setCookie("userID", formVal.userID);
					setUserIDChgStatus(`ユーザIDが${formVal.userID}に変更されました`)
				} else {
					setUserIDChgStatus('このIDは利用されています');
				}
			})
			.catch(error => {
				console.log('error');
			})
		}
	}

	const submitUserName = (event) => {
		event.preventDefault();
		const req = {settingName: 'userName', userID: cookies.userID, chgSetting: formVal.userName};
		Axios.post(baseURL + '/userconfchg/', req)
		.then((response) => {
			if(response.data.status === 'success') {
				setUserNameChgStatus(`ユーザ名が${formVal.userName}に変更されました`)
			} else {
				setUserNameChgStatus('ユーザ名の登録が正常に行われませんでした');
			}
		})
		.catch(error => {
			console.log('error');
		})
	}

	const submitPassword = async (event) => {
		event.preventDefault();
		if (passwordVal == '' || passwordConfirmVal == '') {
			setPasswordChgStatus('パスワードを入力してください')
		} else {
			if (passwordVal != passwordConfirmVal) {
				console.log(passwordVal, passwordConfirmVal)
				setPasswordChgStatus('パスワードが一致しません')
			} else {
				const req = {settingName: 'password', userID: cookies.userID, chgSetting: await sha256(passwordVal)};
				Axios.post(baseURL + '/userconfchg/', req)
				.then((response) => {
					if(response.data.status === 'success') {
						formVal.password = passwordVal;
						setPasswordChgStatus('パスワードが正常に登録されました')
					} else {
						setPasswordChgStatus('パスワードの登録が正常に行われませんでした');
					}
				})
				.catch(error => {
					console.log('error');
				})
			}
		}
	}

	const submitBio = (event) => {
		event.preventDefault();
		const req = {userID: cookies.userID, chgBio: formVal.bio};
		Axios.post(baseURL + '/userconfchg/bio/', req)
		.then((response) => {
			if(response.data.status === 'success') {
				setBioChgStatus('自己紹介文が正常に変更されました');
			} else {
				setBioChgStatus('自己紹介文の更新が正常に行われませんでした');
			}
		})
		.catch(error => {
			console.log('error');
		})
	}

	return (
		<>
			<div className={pageStyle.wholeArea}>
				<div className={pageStyle.leftArea}>
					<h2>Setting</h2>
					<form onSubmit={submitUserID}>
						<div className={styles.formWrapper}>
							<label>ユーザID</label>
							<input 
								type="text" 
								name="userID" 
								value={formVal.userID}
								onChange={inputChg}
								placeholder="小文字，数字，「_」" 
								inputMode="numeric"
								pattern="^[a-z0-9_]+$" />
						</div>
						<div className={styles.formWrapper}>
							<button type="submit" className={styles.submit}>ユーザIDを変更</button>
						</div>
					</form>
					<p>{userIDChgStatus}</p>
					<form onSubmit={submitUserName}>
						<div className={styles.formWrapper}>
							<label>ユーザ名</label>
							<input 
								type="text" 
								name="userName" 
								value={formVal.userName} 
								onChange={inputChg}
								placeholder="" />
						</div>
						<div>
							<button type="submit" className={styles.submit}>ユーザ名を変更</button>
						</div>
					</form>
					<p>{userNameChgStatus}</p>
					<form onSubmit={submitPassword}>
						<div className={styles.formWrapper}>
							<label>パスワード</label>
							<input 
								type="password" 
								name="password" 
								value={formVal.password} 
								onChange={inputChg}
								placeholder="英数字 (8~32字)"
								minLength={8}
								maxLength={32} />
						</div>
						<div className={styles.formWrapper}>
							<label>パスワード (確認)</label>
							<input 
								type="password" 
								name="passwordConfirm" 
								value={formVal.passwordConfirm} 
								onChange={inputChg}
								placeholder="英数字 (8~32字)"
								minLength={8}
								maxLength={32} />
						</div>
						<div>
							<button type="submit" className={styles.submit}>パスワードを変更する</button>
						</div>
					</form>
					<p>{passwordChgStatus}</p>
					<form onSubmit={submitBio}>
						<div className={styles.formWrapper}>
							<label>自己紹介文</label>
							<input 
								type="text" 
								name="bio" 
								value={formVal.bio}
								onChange={inputChg}
								placeholder="bio" />
						</div>
						<div>
							<button type="submit" className={styles.submit}>自己紹介文を変更する</button>
						</div>
					</form>
					<p>{bioChgStatus}</p>
					<UserDelete />
				</div>
				<div className={pageStyle.rightArea}>
					<Navi />
				</div>
			</div>
		</>
	)
}
export default UserConfChg;