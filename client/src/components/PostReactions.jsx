import Axios from "axios";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";

import styles from "../styles/reaction.module.css"
import baseURL from "../modules/conf";

function PostReactions(props) {
	const [cookies, setCookie, removeCookie] = useCookies(["userID", "password"]);

	let attachBoolean = JSON.parse(props.attach.toLowerCase());

	const submit = (event) => {
		event.preventDefault();
		let attatchDetach = ''
		if (attachBoolean == true) {
			attatchDetach = 'attach'
		} else {
			attatchDetach = 'detach'
		}
		console.log((baseURL+`/postreaction/${attatchDetach}/${cookies.userID}/${props.userID}/${props.postDate}/${props.sentiment}`))

		Axios.get(baseURL+`/postreaction/${attatchDetach}/${cookies.userID}/${props.userID}/${props.postDate}/${props.sentiment}`)
		.then((response) => {
			attachBoolean = !attachBoolean
		})
	}
	return (
		<>
			<form onSubmit={submit}>
				<button type="submit" className={styles.reaction}>{props.sentiment}</button>
			</form>
		</>
	)
}

export default PostReactions;