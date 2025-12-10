import { useEffect } from "react";

export default function RouteWithTitle({ title, children }) {
  useEffect(() => {
    document.title = !title || title === "Home" ? "AURAYE" : `${title} | AURAYE`;
  }, [title]);

  return children;
}
