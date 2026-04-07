import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import Layout from "./layout/Layout"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import Dashboard from "./pages/Dashboard/Dashboard"
import Tasks from "./pages/Tasks/Tasks"
import Projects from "./pages/Projects/Projects"
import Priorities from "./pages/Priorities/Priorities"
import Comments from "./pages/Comments/Comments"
import ProjectMembers from "./pages/ProjectMembers/ProjectMembers"
import TaskAssignments from "./pages/TaskAssignments/TaskAssignments"
import Guard from "./guards/Guard"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/priorities" element={<Priorities />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/project-members" element={<ProjectMembers />} />
          <Route path="/task-assignments" element={<TaskAssignments />} />
         <Route element={<Guard/>}>
          {/* <Route path="genres" element={<Genres />} /> */}
          {/* <Route path="movies" element={<Movies />} /> */}
        </Route> 
       </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
