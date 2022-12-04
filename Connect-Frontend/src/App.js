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
import UpdateNotes from "./pages/Notes/UpdateNotes";
import CreateHomework from "./pages/Homework/CreateHomework";
import UpdateHomework from "./pages/Homework/UpdateHomework";
import CreateSession from "./pages/Sessions/Therepuet/CreateSession";
import Qualifications from "./pages/Qualifications/Qualifications";
import UpdateQualification from "./pages/Qualifications/UpdateQualification";
import CreateQualification from "./pages/Qualifications/CreateQualification";
import Footer from "./global/Footer";
function App() {
  return (
    <div>
      <Navbar />
      <div style={{marginBottom:"100px"}}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/user" element={<Login />} />
          <Route path="/register-therepuet" element={<RegisterTherepuet />} />
          <Route path="/register" element={<RegisterUser />} />

          <Route path="/">
            <Route path="/qualifications" element={<Qualifications />} />
            <Route
              path="/new-qualification"
              element={<CreateQualification />}
            />
            <Route path="/qualifications/:qualificationId">
              <Route index element={<UpdateQualification />} />
            </Route>
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/new-session" element={<CreateSession />} />
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
            </Route>
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
export default App;
