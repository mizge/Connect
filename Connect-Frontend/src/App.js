import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./global/NavBar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import RegisterTherepuet from "./pages/RegisterTherepuet";
import RegisterUser from "./pages/RegisterUser";
import Sessions from "./pages/Sessions/Sessions";
import SessionInfo from "./pages/Sessions/SessionInfo";
import Therepuets from "./pages/Therepuets/Therepuets";
import TherepuetInfo from "./pages/Therepuets/TherepuetInfo";
import { store } from "./app/store";
import UpdateNotes from './pages/Notes/UpdateNotes'
import CreateHomework from './pages/Homework/CreateHomework'
import UpdateHomework from './pages/Homework/UpdateHomework'
import CreateSession from './pages/Sessions/Therepuet/CreateSession'
function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/user" element={<Login />} />
        <Route path="/user/client" element={<RegisterUser />} />
        <Route path="/user/therepuet" element={<RegisterTherepuet />} />

        <Route path="/">
          <Route path="/sessions" element={<Sessions />}/>
          <Route path="/new-session" element={<CreateSession />}/>
          <Route path="/sessions/:sessionId">
            <Route index element={<SessionInfo />} />
          </Route>
          <Route path="/sessions/:sessionId/notes">
            <Route index element={<UpdateNotes />} />
          </Route>
          <Route path="/sessions/:sessionId/homeworks">
            <Route index element={<CreateHomework />} />
          </Route>
          <Route path="/sessions/:sessionId/homeworks/:homeworkId">
            <Route index element={<UpdateHomework />} />
          </Route>
        </Route>

        <Route path="/qualifications/:qualificationId/therepuets/">
          <Route index element={<Therepuets />} />
          <Route path="/qualifications/:qualificationId/therepuets/:therepuetId">
            <Route index element={<TherepuetInfo />} />
            {/* <Route path='edit' element={<ProtectedRoute/>}>
									<Route index element={<EditMovie/>}/>
								</Route> */}
            {/* Here I will have create session? only for therepuets
                <Route path='sessions'>
									<Route index element={<Sessions/>}/>
									<Route path='create' element={<ProtectedRoute/>}>
										<Route index element={<CreateSession/>}/>
									</Route>
								</Route> */}
          </Route>
        </Route>
      </Routes>
    </div>
  );
}
export default App;
