// src/App.jsx
import { ToastContainer } from "react-toastify";
import AppRouter from "./router/AppRouter";
import "react-toastify/dist/ReactToastify.css";
import ChatWidget from "./components/ChatWidget";

const PROJECT_CONTEXT = `
Our project is an AR-powered eyewear e-commerce website.
Users can:
- Browse optical and sunglasses frames
- Use AR try-on to preview glasses on their face using the camera
- Filter by frame material, shape, color, and brand
- Save favorites and manage wishlist
- Place orders with secure online payment and track shipping

Business rules:
- Shipping: 2–5 business days locally
- Returns allowed within 14 days if the frame is unused and in original packaging
- Some frames support blue-light filter lenses and prescription lenses
- AR works best in good lighting and with a clear front face

(👉 Paste here ANY extra details you want the chatbot to know: pricing rules, delivery areas, AR limitations, warranty, etc.)
`;

export default function App() {

  return (
    <>
      <div className="font-sans  hide-scrollbar">
        <ToastContainer position="top-right" />
        <AppRouter />
        <ChatWidget projectContext={PROJECT_CONTEXT} />
      </div>
    </>
  );
}
