import { ToastContainer } from "react-toastify";
import AppRouter from "./router/AppRouter";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  console.log("API URL (PROD):", import.meta.env.VITE_API_URL);

  return (
    <>
      <div className="font-sans hide-scrollbar"  >
      <ToastContainer 
        position="top-right" 
      />
        <AppRouter />
      </div>
    </>
  );
}
