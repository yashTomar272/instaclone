import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import HomePage from './HomePage';
import BirthPage from './BirthPage';
import OtpPage from './OtpPage';
import CreateStory from './CreateStory';
import EmailPage from './EmailPage';
import Suggesion from './Suggesion';
import SearchPage from './SearchPage';
import SearchProfile from './SearchProfile';
import MainProfile from './MainProfile';
import EditProfile from './EditProfile';
import ActiveSettingpage from './ActiveSettingpage';
import SeeAll from './SeeAll';
import SearchFollowers from './SearchFollowers';
import SearchFollowing from './SearchFollowing';
import FollowersPage from './FollowersPage';
import CreatePost from './CreatePost';
import Save from './Save';
import StoryPage from './StoryPage';
import HandleReelPost from './HandleReelPost';
import ReelPage from './ReelPage';
import ReelSecond from './ReelSecond';
import Explore from './Explore';
import ZZZ from './ZZZ';
import EditProfile3 from './EditProfile3';
import SearchEx from './SearchEx';
import NotificationSecond from './NotificationSecond';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import './App.css'

import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import {FirebaseProvider} from "./Firebase";

export default function App(){
  return(
    <FirebaseProvider>
      <Router>
        <Routes>
        
          <Route path="/instaclone" element={<LoginPage />} />
          <Route path="/SignUpPage" element={<SignUpPage />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/NotificationSecond" element={<NotificationSecond />} />
          <Route path="/ZZZ" element={<ZZZ />} />
          <Route path="/EditProfile3" element={<EditProfile3 />} />
          <Route path="/BirthPage" element={<BirthPage />} />
          <Route path="/SearchEx" element={<SearchEx />} />
          <Route path="/OtpPage" element={<OtpPage />} />
          <Route path="/EmailPage" element={<EmailPage />} />
          <Route path="/Suggesion" element={<Suggesion />} />
          <Route path="/SearchPage" element={<SearchPage />} />
          <Route path="/MainProfile" element={<MainProfile />} />
          <Route path="/EditProfile" element={<EditProfile />} />
          <Route path="/FollowersPage" element={<FollowersPage />} />
          <Route path="/SearchFollowers" element={<SearchFollowers />} />
          <Route path="/SearchFollowing" element={<SearchFollowing />} />
          <Route path="/ActiveSettingpage" element={<ActiveSettingpage />} />
          <Route path="/CreateStory" element={<CreateStory />} />
          <Route path="/SeeAll" element={<SeeAll />} />
          <Route path="/CreatePost" element={<CreatePost />} />
          <Route path="/Save" element={<Save />} />
          <Route path="/ReelSecond/:id/:reelsId" element={<ReelSecond />} />
          <Route path="/ReelPage" element={<ReelPage />} />
          <Route path="/Explore" element={<Explore />} />
          <Route path="/StoryPage/:id" element={<StoryPage />} />
          <Route path="/HandleReelPost/:id/:postId" element={<HandleReelPost />} />
          <Route path="/SearchProfile/:id" element={<SearchProfile />} />
        </Routes>
      </Router>
    </FirebaseProvider>
  )
}
