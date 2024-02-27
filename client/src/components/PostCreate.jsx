import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import pageStyle from "../styles/page.module.css"
import postStyle from "../styles/post.module.css"
import Navi from "./Navi";
let baseURL = require('../modules/conf');

function PostCreate() {

	const [cookies, setCookie, removeCookie] = useCookies(["userID", "password"]);

	const [contentVal, setContent] = useState([]);
	const [attention, setAttention] = useState([]);

	const inputChg = (event) => {
		const {name, value} = event.target;
		setContent(value);
	}

	const navigate = useNavigate();

	const submit = (event) => {
		event.preventDefault();
		if (contentVal === undefined || contentVal.length === 0) {
			setAttention('文字を入力してください');
		} else {
			Axios.get(baseURL+`/postcreate/${cookies.userID}/${contentVal}`)
			.then((response) => {
				navigate('/home');
			})
		}
	}

	return (
		<div className={pageStyle.wholeArea}>
			<div className={pageStyle.leftArea}>
				<h2>Post</h2>
				<div>
					<form onSubmit={submit}> 
						<div>
							<label></label>
							<textarea
								name='content'
								value={contentVal}
								onChange={inputChg}
								placeholder=""
								className={postStyle.textareaPost} />
						</div>
						<div>
							<button type="submit" className={postStyle.action}>投稿</button>
						</div>
					</form>
					<p>{attention}</p>
				</div>
			</div>
			<div className={pageStyle.rightArea}>
				<Navi />
			</div>
		</div>
	)
}

export default PostCreate;