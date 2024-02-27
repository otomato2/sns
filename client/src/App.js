import React from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import {CookiesProvider} from "react-cookie";

import Auth from './components/Auth';
// import User from './components/User';
import Posts from './components/Post';
import Timeline from './components/Timeline';
import Attention from './components/Attention';
import ReplyCreate from './components/ReplyCreate';
import UserCreate from './components/UserCreate';
import Home from './components/Home';
import UserConfChg from './components/UserConfChg';
import User from './components/User';
import ChatBranch from './components/ChatBranch';
import Chat from './components/Chat';
import PostCreate from './components/PostCreate';
import Search from './components/Search';
import Terms from './components/Terms';

function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path={'/'} element={<Auth />} />
          <Route path={'/post/:userIDParam/:postDateParam/'} element={<Posts />} />
          <Route path={'/postcreate'} element={<PostCreate />} />
          <Route path={'/timeline'} element={<Timeline />} />
          <Route path={'/replycreate'} element={<ReplyCreate />} />
          <Route path={'/search'} element={<Search />} />
          <Route path={'/usercreate'} element={<UserCreate />} />
          <Route path={'/home'} element={<Home />} />
          <Route path={'/userconfchg'} element={<UserConfChg />} />
          <Route path={'/user/:userIDParam'} element={<User />} />
          <Route path={'/chatbranch'} element={<ChatBranch />} />
          <Route path={'/chat/:userIDParam'} element={<Chat />} />
          <Route path={'/terms'} element={<Terms />} />
          <Route path={':other'} element={<Attention />} />
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;