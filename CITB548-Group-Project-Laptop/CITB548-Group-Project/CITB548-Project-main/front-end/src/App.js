import "./App.css";
import Home from "./components/Home";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
// import ShipmentsList from "./components/Employee/ShipmentsList";

function App() {
  // const userEmail = "iskren201@gmail.com";
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          {/* <ShipmentsList userEmail={userEmail} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
