import { Link } from "react-router-dom";
import Logout from "./Logout";

import styles from '../styles/navi.module.css'

function Navi() {
	return (
		<div>
			<Logout />
			<div className={styles.inter}><Link to={'/timeline/'} className={styles.naviLink}>Timeline</Link></div>
			<div className={styles.inter}><Link to={'/postcreate'} className={styles.naviLink}>Post</Link></div>
			<div className={styles.inter}><Link to={'/search'} className={styles.naviLink}>User search</Link></div>
			<div className={styles.inter}><Link to={'/home/'} className={styles.naviLink}>Home</Link></div>
			<div className={styles.inter}><Link to={'/chatbranch/'} className={styles.naviLink}>Chat</Link></div>
			<div className={styles.inter}><Link to={'/userconfchg/'} className={styles.naviLink}>Settings</Link></div>
		</div>
	)
}

export default Navi;