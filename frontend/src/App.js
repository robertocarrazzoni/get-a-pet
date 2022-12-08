import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './components/pages/Home';
import Login from "./components/pages/auth/Login";
import Register from "./components/pages/auth/Register";
import Profile from "./components/pages/user/Profile";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Container from "./components/layout/Container";
import Message from "./components/layout/Message";
import { UserProvider } from "./context/UserContext";
import MyPets from "./components/pages/pet/MyPets";
import AddPet from "./components/pages/pet/AddPet";
import EditPet from "./components/pages/pet/EditPet";
import PetDetails from "./components/pages/pet/PetDetails";

function App() {
  return (
    <BrowserRouter>
    <UserProvider>
      <Navbar />
        <Message />
        <Container>
          <Routes>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/user/profile" element={<Profile />}/>
            <Route path="/pet/mypets" element={<MyPets />}/>
            <Route path="/pet/add" element={<AddPet />}/>
            <Route path="/pet/edit/:id" element={<EditPet />}/>
            <Route path="/pet/:id" element={<PetDetails />}/>
            <Route path="/" element={<Home />}/>
          </Routes>
        </Container>
      <Footer />
    </UserProvider>
    </BrowserRouter>
  );
}

export default App;
