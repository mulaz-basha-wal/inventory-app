import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import InventoryManagerAuth from "./Conponents/InventoryManagerAuth";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./Conponents/ProtectedRoute";
import Home from "./Conponents/Home";
import Profile from "./Conponents/Profile";
import IMenu from "./Conponents/Menu";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<InventoryManagerAuth />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/inventory' element={<IMenu />}>
            <Route path='dashboard' element={<Home />} />
            <Route path='profile' element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
