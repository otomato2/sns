import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

import pageStyle from "../styles/page.module.css";
import postStyle from "../styles/post.module.css";

import Navi from "./Navi";
import PostReactions from "./PostReactions";
import ReplyCreate from "./ReplyCreate";
let baseURL = require('../modules/conf');

function postParse (response) {
  return (
    <div>
      {response.map((item) => {
        const datetimeISO = item['datetime'].slice(0, 10) + ' ' + item['datetime'].slice(11, 16);
        const datetimeUnix = Date.parse(item['datetime']);
        return (
          <div className={postStyle.whole}>
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
        )
      })}
    </div>
  )
}

function Timeline() {

  const [cookies, setCookie, removeCookie] = useCookies(["userID", "password"]);
  const [parseResult, setParseResult] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    Axios.get(baseURL+`/timeline/${cookies.userID}/`)
    .then((response) => {
      if (response.data.status === 'none') {
        setParseResult('no post');
        return;
      } else {
        setParseResult(postParse(response.data));
      }
    });
  }, []);

  return (
    <>
      <div className={pageStyle.wholeArea}>
        <div className={pageStyle.leftArea}>
          <h2>Timeline</h2>
          {parseResult}
        </div>
        <div className={pageStyle.rightArea}>
          <Navi />
        </div>
      </div>
    </>
  )
}

export default Timeline;