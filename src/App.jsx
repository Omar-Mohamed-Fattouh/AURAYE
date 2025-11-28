import { ToastContainer } from "react-toastify";
import AppRouter from "./router/AppRouter";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <div className="font-sans">
      <ToastContainer 
        position="top-right" 
      />
        <AppRouter />
      </div>
    </>
  );
}
