import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

import chatStyle from "../styles/chat.module.css"
let baseURL = require('../modules/conf');

function ChatSend(props) {

	const [cookies, setCookie, removeCookie] = useCookies(["userID", "password"]);

	const [contentVal, setContent] = useState([]);
	const [attention, setAttention] = useState([]);
	const [chatSendFormVisible, setChatSendFormVisible] = useState(false);

	const inputChg = (event) => {
		event.preventDefault();
		const {name, value} = event.target;
		setContent(value);
	}

	const submit = (event) => {
		event.preventDefault();
		if (contentVal === undefined || contentVal.length === 0) {
			setAttention('文字を入力してください');
		} else {
			Axios.get(baseURL+`/chatsend/${cookies.userID}/${props.userID}/${contentVal}`)
			.then((response) => {
				window.location.reload();
			})
		}
	}

	const openChatSendForm = (event) => {
		setChatSendFormVisible(true)
	}

	const closeChatSendForm = (event) => {
		setChatSendFormVisible(false)
	}

	return (
		<>
			{!chatSendFormVisible ?
			(<form onSubmit={openChatSendForm}>
				<button type='submit' className={chatStyle.chatSend}>Chat</button>
			</form>) :
			(<div>
				<form onSubmit={submit}> 
					<div>
					<label></label>
					<textarea
						name='content'
						value={contentVal}
						onChange={inputChg}
						placeholder=""
						className={chatStyle.textareaChat} />
					</div>
					<div>
						<button type="submit" className={chatStyle.chatSend}>送信</button>
					</div>
				</form>
				<form onSubmit={closeChatSendForm}>
					<button type="submit" className={chatStyle.chatSend}>閉じる</button>
				</form>
				<p>{attention}</p>
				</div>)
			}
		</>
	)
}

export default ChatSend;