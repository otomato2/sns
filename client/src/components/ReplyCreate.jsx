import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import styles from "../styles/reaction.module.css"
let baseURL = require('../modules/conf');

function ReplyCreate (props) {

	const navigate = useNavigate();

	const [cookies, setCookie, removeCookie] = useCookies(["userID", "password"]);

	const [formVal, setFormVal] = useState({
		mention: props.mentionPrev,
		content: ''
	});

	const [mentionVal, setMention] = useState(props.mentionPrev);
	const [contentVal, setContent] = useState([]);
	const [attention, setAttention] = useState([]);
	const [replyFormVisible, setReplyFormVisible] = useState(false);

	if (mentionVal === undefined || mentionVal.length === 0) {
		setMention('none')
	}

	const inputChg = (event) => {
		const {name, value} = event.target;
		setFormVal({...formVal, [name]: value});
		if (name === 'mention') {
			setMention(value);
		} else if (name === 'content') {
			setContent(value);
		} else {
			console.log('error');
		}
	}

	const submit = (event) => {
		event.preventDefault();
		if (contentVal === undefined || contentVal.length === 0) {
			setAttention('文字を入力してください');
		} else {
			Axios.get(baseURL+`/replycreate/${cookies.userID}/${props.userID}/${props.postDate}/${mentionVal}/${contentVal}`)
			.then((response) => {
				window.location.reload();
			})
		}
	}

	const openReply = (event) => {
		setReplyFormVisible(true)
	}

	const closeReply = (event) => {
		setReplyFormVisible(false)
	}

	return (
		<>
			{!replyFormVisible ?
			(<form onSubmit={openReply}>
				<button type='submit' className={styles.reaction}>Reply</button>
			</form>) :
			(<div>
				<form onSubmit={submit}> 
					<div className={styles.space}>
						<label>関連する人</label>
						<input
							type='text'
							name='mention'
							value={formVal.mention}
							onChange={inputChg}
							placeholder="mention" />
					</div>
					<div>
					<label>内容</label>
						<textarea
							name='content'
							value={formVal.content}
							onChange={inputChg}
							placeholder=""
							className={styles.textareaReply} />
					</div>
					<div>
						<button type="submit">返信する</button>
					</div>
				</form>
				<form onSubmit={closeReply}>
					<button type="submit">閉じる</button>
				</form>
				<p className={styles.small}>{attention}</p>
				</div>)
			}
		</>
	)
}

export default ReplyCreate;