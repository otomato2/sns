import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link, useParams } from "react-router-dom";

import pageStyle from "../styles/page.module.css"
import chatStyle from "../styles/chat.module.css"
import Navi from "./Navi";
import ChatSend from "./ChatSend";
let baseURL = require('../modules/conf');

function chatParse(response, cookies) {
	return (
		<div>
			{response.map((item) => {
				const datetimeISO = item['datetime'].slice(0, 10) + ' ' + item['datetime'].slice(11, 16);
				if (item['sender'] !== cookies.userID) {
					console.log('left')
					return (
						<>
							<div className={chatStyle.wholeLeft}>
								<p className={chatStyle.leftSmall}>
									@{item['sender']}
								</p>
								<p className={chatStyle.left}>{item['content']}</p>
								<p className={chatStyle.dateLeft}>{datetimeISO}</p>
							</div>
						</>
					)
				} else {
					console.log('right')
					return (
						<>
							<div className={chatStyle.wholeRight}>
								<p className={chatStyle.right}>{item['content']}</p>
								<p className={chatStyle.dateRight}>{datetimeISO}</p>
							</div>
						</>
					)
				}
			})}
		</div>
	)
}

function Chat() {
	const chatParams = useParams();
	
	const [cookies, setCookie, removeCookie] = useCookies(["userID", "password"]);
	const [chatVal, setChatVal] = useState('')

	useEffect(() => {
		Axios.get(baseURL + `/chat/${cookies.userID}/${chatParams['userIDParam']}`)
		.then((response) => {
			if ( JSON.stringify(response['data']['status']) === '"failure"') {
				setChatVal('会話はまだありません');
			} else {
				setChatVal(chatParse(response.data, cookies));
			}
		})
	}, []);
	
	return (
		<div className={pageStyle.wholeArea}>
			<div className={pageStyle.leftArea}>
				<h2><Link to={`/user/${chatParams['userIDParam']}`} className={chatStyle.userID}>@{chatParams['userIDParam']}</Link></h2>
				<div className={chatStyle.sendButtoun}>
					<ChatSend userID={chatParams['userIDParam']} />
				</div>
				<div>{chatVal}</div>
				</div>
			<div className={pageStyle.rightArea}>
				<Navi />
			</div>
		</div>
	)
}

export default Chat;