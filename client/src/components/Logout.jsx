import React from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import styles from "../styles/navi.module.css"

function Logout() {
	const [cookies, setCookie, removeCookie] = useCookies(["userID", "password"]);
	const navigate = useNavigate();
	const submit = (event) => {
		event.preventDefault();
		removeCookie("userID");
		removeCookie("password");
		navigate("/");
	}
	return (
		<>
			<form onSubmit={submit}>
				<button type="submit" className={styles.logout}>Logout</button>
			</form>
		</>
	)
}
export default Logout;