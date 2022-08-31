import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './components/pages/Home';
import Login from "./components/pages/auth/Login";
import Register from "./components/pages/auth/Register";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Container from "./components/layout/Container";
import Message from "./components/layout/Message";
import { UserProvider } from "./context/UserContext";

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
            <Route path="/" element={<Home />}/>
          </Routes>
        </Container>
      <Footer />
    </UserProvider>
    </BrowserRouter>
  );
}

export default App;
