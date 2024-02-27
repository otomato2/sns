import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import pageStyle from "../styles/page.module.css";
import chatStyle from "../styles/chat.module.css"
import Navi from "./Navi";

function ChatBranch() {
	const [userIDVal, setUserIDVal] = useState('');
	const [attention, setAttention] = useState('');

	const inputChg = (event) => {
		const {name, value} = event.target;
		setUserIDVal(value)
	}

	const navigate = useNavigate();

	const submit = (event) => {
		event.preventDefault();
		if (userIDVal == ''){
			setAttention('ユーザIDを入力してください');
		}
		navigate(`/chat/${userIDVal}`);
	}
	
	return (
		<div className={pageStyle.wholeArea}>
			<div className={pageStyle.leftArea}>
				<h2>Chat</h2>
				<form onSubmit={submit}>
					<div>
						<label>会話相手</label>
						<input 
							type="text" 
							name="userID" 
							value={userIDVal}
							onChange={inputChg}
							placeholder="User ID" />
					</div>
					<div>
						<button type="submit" className={chatStyle.chatStart}>会話に進む</button>
					</div>
				</form>
				<div>{attention}</div>
			</div>
			<div className={pageStyle.rightArea}>
				<Navi />
			</div>
		</div>
	)
}

export default ChatBranch;