import Axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import styles from "../styles/authCreate.module.css";
import naviStyles from "../styles/navi.module.css"
const baseURL = require('../modules/conf');

// sha256
async function sha256(plainPassword){
	const data  = new TextEncoder().encode(plainPassword);
	const digest = await crypto.subtle.digest('SHA-256', data);
	return Array.from(new Uint8Array(digest)).map(h => h.toString(16).padStart(2,'0')).join('');
}

function UserDelete() {

  const [cookies, setCookie, removeCookie] = useCookies(["userID", "password"]);

	const [formVal, setFormVal] = useState({
		password: '',
		passwordConfirm: ''
	});

	const [passwordVal, setPasswordVal] = useState('');
	const [passwordConfirmVal, setPasswordConfirmVal] = useState("");
	const [deleteFormVisible, setDeleteFormVisible] = useState(false);
	const [thanksVal, setThanksVal] = useState('');
	const [linkVal, setLinkVal] = useState('');
	const [attention, setAttention] = useState('');

	const inputChg = async (event) => {
		const {name, value} = event.target;
		setFormVal({...formVal, [name]: value});
		if (name === 'password') {
			setPasswordVal(value);
		} else if (name === 'passwordConfirm') {
			setPasswordConfirmVal(value);
		}
	}

	const submit = async (event) => {
		event.preventDefault();
		if (passwordVal == '' || passwordConfirmVal == '') {
			setAttention('パスワードを入力してください')
		} else {
			if (passwordVal != passwordConfirmVal) {
				console.log(passwordVal, passwordConfirmVal)
				setAttention('パスワードが一致しません')
			} else {
				const req = {userID: cookies.userID, password: await sha256(passwordVal)}
				Axios.post(baseURL + '/userdelete/', req)
				.then((response) => {
					if(response.data.status === 'success') {
						removeCookie('userID');
						removeCookie('password');
						setThanksVal('ご利用いただきありがとうございました');
						setAttention('');
						setLinkVal('Top page');
					} else {
						setAttention('パスワードが誤っています');
						setAttention('');
					}
				})
				.catch(error => {
					console.log('error');
				})
			}
		}
	}

	const openPasswordForm = (event) => {
		setDeleteFormVisible(true);
	}

	const closePasswordForm = (event) => {
		setDeleteFormVisible(false);
	}

	return (
		<>
			{!deleteFormVisible ? 
			(<form onSubmit={openPasswordForm}>
				<button type="submit" className={styles.submit}>退会</button>
			</form>) : 
			(<div>
				<form onSubmit={submit}> 
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
						<button type="submit" className={styles.delete}>退会</button>
					</div>
				</form>
				<form onSubmit={closePasswordForm}>
					<button type="submit" className={styles.submit}>閉じる</button>
				</form>
				<p>{thanksVal}</p>
				<p>{attention}</p>
				<div className={naviStyles.center}><Link to={'/'} className={naviStyles.naviLink}>{linkVal}</Link></div>
				</div>)
			}
		</>
	)
}

export default UserDelete;