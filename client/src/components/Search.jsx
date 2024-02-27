import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import pageStyle from "../styles/page.module.css"
import searchStyle from "../styles/search.module.css"
import Navi from "./Navi";
let baseURL = require('../modules/conf');

function Search() {

	const [userIDVal, setUserIDVal] = useState([]);
	const [attention, setAttention] = useState([]);

	const inputChg = (event) => {
		event.preventDefault();
		const {name, value} = event.target;
		setUserIDVal(value);
	}

	const navigate = useNavigate();

	const submit = (event) => {
		event.preventDefault();
		if (userIDVal === undefined || userIDVal.length === 0) {
			setAttention('文字を入力してください');
		} else {
			Axios.get(baseURL+`/user/${userIDVal}/`)
			.then((response) => {
				if (JSON.stringify(response["data"]["status"]) == '"failure"') {
					setAttention('存在しないユーザです')
				} else {
					navigate(`/user/${userIDVal}`);
				}
			})
		}
	}

	return (
		<>
			<div className={pageStyle.wholeArea}>
				<div className={pageStyle.leftArea}>
					<h2>User Search</h2>
					<div>
					<form onSubmit={submit}> 
						<div>
							<label>ユーザID</label>
							<input 
								type="text" 
								name="userID" 
								value={userIDVal}
								onChange={inputChg}
								placeholder="小文字，数字，「_」" 
								inputMode="numeric"
								pattern="^[a-z0-9_]+$"
								required />
						</div>
						<div>
							<button type="submit" className={searchStyle.action}>検索</button>
						</div>
					</form>
					<p>{attention}</p>
				</div>
				</div>
				<div className={pageStyle.rightArea}>
					<Navi />
				</div>
			</div>
		</>
	)
}

export default Search;