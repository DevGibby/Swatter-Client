import { useState, useEffect, useRef } from "react";
import axios from "axios";

// styles
import GlobalStyles from "./GlobalStyles";

// components
import Nav from "./components/Nav";
import { Alert } from "./components/Alert";

// pages
import { HomePage } from "./pages/HomePage/HomePage.js";
import { ProjectPage } from "./pages/ProjectPage/ProjectPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import RegisterUserPage from "./pages/RegisterUserPage.js";
import { MainBugPage }from "./pages/BugPage/MainBugPage.js";
import CreateBugPage from "./pages/CreateBugPage/CreateBugPage.js";
import { SprintsPage } from "./pages/Sprints/SprintsPage.js";
import ProjectDetailsPage from "./pages/DetailsPage/ProjectDetailsPage.js";
import ArchivePage from "./pages/ArchivePage/Archive";
import { HelpPage } from "./pages/HelpPage/HelpPage.js";

// router
import { Route, Routes, useNavigate } from "react-router-dom";

// redux
import { useDispatch } from 'react-redux';
import { handleUser } from './redux/actions/user.js';

//functions
import { handleTokens } from "./functions/handleTokens";
import { handleAlert } from "./functions/handleAlert";

function App() {
  
  const AlertRef = useRef();
  const projectSideNavRef = useRef();

  const [ message, setMessage ] = useState('')
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  onbeforeunload = (event) => { logout(); };

  useEffect(() => {
    let token = sessionStorage.getItem("token");
    let username = sessionStorage.getItem("username");
    const handlePageReload = (token) => {
      setLoading(true);
      setTimeout(() => {
        axios.post(`${process.env.REACT_APP_BASE_URL}/validateTokens`, { token: token })
        .then((response) => {
          if(response.data === 'Token Not Valid'){
            setLoggedIn(false);
            setLoading(false);
            sessionStorage.clear();
            navigate("/LoginPage");
          } else {
            setLoggedIn(true);
            setLoading(false);
            dispatch(handleUser(username, response.data, token));
          }
        })
        .catch((err) => {
          console.log(err)
          setLoggedIn(false);
          setLoading(false);
          sessionStorage.clear();
          navigate("/LoginPage");
        });
      }, 1000);
    }
    if(token){
      handlePageReload(token);
    }
  }, [ navigate, dispatch ]);

  const login = () => {
    if(!password || !username){
      setMessage("Enter A Username or Password");
      handleAlert(AlertRef);
    } else {
      setLoading(true);
      axios.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_LOGIN_URL}`,
        {
          username: username,
          password: password,
        }
      )
      .then((response) => {
        handleTokens(response.data, username);
        axios.post(`${process.env.REACT_APP_BASE_URL}/validateTokens`, { token: response.data })
        .then((res) => {
          if(res.status === 200){
            setLoggedIn(true);
            setLoading(false);
            dispatch(handleUser(username, res.data));
            navigate("/");
          }
        })
        .catch((err) => {
          console.log(err);
          sessionStorage.clear();
          setMessage("Wrong Username or Password");
          handleAlert(AlertRef);
          setLoading(false);
          setLoggedIn(false);
          navigate("/LoginPage");
        });
      })
      .catch((err) => {
        console.log(err);
        sessionStorage.clear();
        setMessage("Wrong Username or Password");
        handleAlert(AlertRef);
        setLoading(false);
        setLoggedIn(false);
        navigate("/LoginPage");
      });
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setLoggedIn(false);
    setPassword("");
    setUsername("");
    navigate("/LoginPage");
    setLoading(false);
  };

  return (
    <>
      <GlobalStyles />
      {
        !isLoggedIn ? 
          <>
            <Alert
              message={message}
              handleAlert={handleAlert}
              AlertRef={AlertRef}
            />
            <LoginPage
              login={login}
              setUsername={setUsername}
              setPassword={setPassword}
              isLoading={isLoading}
              message={message}
              handleAlert={handleAlert}
              AlertRef={AlertRef}
            />
          </>
        : 
        <>
          <Nav logout={logout} projectSideNavRef={projectSideNavRef} />
          <Routes>
            <Route path='/' exact element={ <HomePage /> } />
            <Route path='/:projectId/:bugId' exact element={ <MainBugPage /> }  />
            <Route path='/projects/:projectId' exact element={ <ProjectPage projectSideNavRef={projectSideNavRef} /> } />
            <Route path='/project/:projectId/sprints' exact element={ <SprintsPage /> } />
            <Route path='/CreateProjectPage' exact element={ <CreateProjectPage /> } />
            <Route path='/:projectId/CreateBugPage' exact element={ <CreateBugPage /> } />
            <Route path='/:projectId/details' exact element={ <ProjectDetailsPage /> } />
            <Route path='/ProfilePage' exact element={ <ProfilePage /> } />
            <Route path='/RegisterUserPage' exact element={ <RegisterUserPage /> } />
            <Route path='/:projectId/archive' exact element={ <ArchivePage />} />
            <Route path='/help' exact element={ <HelpPage />} />
          </Routes>
        </>
      }
    </>
  );
}
export default App;
