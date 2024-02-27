import Axios from "axios";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";

import postStyle from "../styles/post.module.css"
import baseURL from "../modules/conf";

function Follow(props) {
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

		Axios.get(baseURL+`/follow/${attatchDetach}/${cookies.userID}/${props.userID}/`)
		.then((response) => {
			attachBoolean = !attachBoolean;
		})
	}
	return (
		<>
			<form onSubmit={submit}>
				<button type="submit" className={postStyle.followAction}>Follow</button>
			</form>
		</>
	)
}

export default Follow;