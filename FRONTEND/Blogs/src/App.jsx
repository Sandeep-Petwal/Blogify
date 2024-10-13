import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";


function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <div 
      className="flex-grow"
      >
      <Navbar />
      <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
