import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";

import pageStyle from "../styles/page.module.css";
import postStyle from "../styles/post.module.css";

import Navi from "./Navi";
import PostReactions from "./PostReactions";
import ReplyCreate from "./ReplyCreate";
let baseURL = require('../modules/conf');

function profileParse(profile, cookies) { 
	return (
		<div>
			<h2>{profile['userName']}</h2>
			<h5>@{cookies['userID']}</h5>
			<p>{profile['bio']}</p>
			<div className={postStyle.follow}>
				<p><span className={postStyle.small}>フォロー</span>  {profile['follow']}</p>
				<p><span className={postStyle.small}>フォロワー</span>  {profile['follower']}</p>
			</div>
		</div>
	)
}

function postParse (response) {
  return (
    <div>
      {response.map((item) => {
        const datetimeISO = item['datetime'].slice(0, 10) + ' ' + item['datetime'].slice(11, 16);
        const datetimeUnix = Date.parse(item['datetime']);
				let divMention = '';
				if (item['mention']) {
					divMention = String(item['mention']).split(',');
					divMention = divMention.map((item) => {return '@' + item})
					divMention = divMention.join(', ')
					console.log(divMention);
				}
        return (
					<div className={postStyle.whole}>
						<div>
							<p  className={postStyle.mention}>{divMention}</p>
							<Link to={`/post/${item['userID']}/${datetimeUnix}/`} className={postStyle.contentLink}>
								<div className={postStyle.content}>
									<p>{item['content']}</p>
								</div>
							</Link>
							<p className={postStyle.date}>{datetimeISO}</p>
							<p className={postStyle.userID}><Link to={`/user/${item['userID']}`}>@{item['userID']}</Link></p>
							<div className={postStyle.line}></div>
							<div className={postStyle.flex}>
								<p><span className={postStyle.small}>Reply</span> {item['reply']}</p>
								<p><span className={postStyle.small}>Like</span> {item['likeCnt']}</p>
								<p><span className={postStyle.small}>Nutral</span> {item['nutralCnt']}</p>
								<p><span className={postStyle.small}>Dislike</span> {item['dislikeCnt']}</p>
							</div>
							<div className={postStyle.line}></div>
							<div className={postStyle.flex}>
								<ReplyCreate userID={item['userID']} postDate={datetimeUnix} mentionPrev={item['mention']} className={postStyle.reaction} />
								<PostReactions attach='true' userID={item['userID']} postDate={datetimeUnix} sentiment='like' className={postStyle.reaction} />
								<PostReactions attach='true' userID={item['userID']} postDate={datetimeUnix} sentiment='nutral' className={postStyle.reaction} />
								<PostReactions attach='true' userID={item['userID']} postDate={datetimeUnix} sentiment='dislike' className={postStyle.reaction} />
							</div>
						</div>
					</div>
        )
      })}
    </div>
  )
}

function Home() {
	const postParams = useParams();
	const [cookies, setCookie, removeCookie] = useCookies(["userID", "password"]);
	const [profileParseResult, setProfileParseResult] = useState([]);
	const [parseResult, setParseResult] = useState([]);
	const [reply, setReply] = useState([]);

	useEffect(() => {
		Axios.get(baseURL+`/user/${cookies.userID}/`)
		.then((response) => {
			setProfileParseResult(profileParse(response.data[0][0], cookies));
			const newResponse = response.data.slice(1);
			setParseResult(postParse(newResponse))
		})
	}, []);

	return (
		<div className={pageStyle.wholeArea}>
			<div className={pageStyle.leftArea}>
				<h2>Home</h2>
				<div>{profileParseResult}</div>
				<div>{parseResult}</div>
			</div>
			<div className={pageStyle.rightArea}>
				<Navi />
			</div>
		</div>
	)
}

export default Home;