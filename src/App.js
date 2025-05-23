import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateSession from './components/CreateSession';
import Session from './components/Session';
import AddOrder from './components/AddOrder';
import ViewOrder from './components/ViewOrder';
import ItemMaster from './components/ItemMaster';
import Register from './components/Register';
import Login from './components/Login';
import ProfileDetails from './components/ProfileDetails';
import { Navigate } from "react-router-dom";

function App() {
  return (
    <div>
       <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/add-order" element={<AddOrder/>} />
        <Route path="/items" element={<ItemMaster/>} />
        <Route path="/view-order" element={<ViewOrder/>} />
        <Route path="/create-session" element={<CreateSession/>} />
        <Route path="/session" element={<Session/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/profile" element={<ProfileDetails />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
