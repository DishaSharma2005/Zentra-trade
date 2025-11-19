import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    alert("Page not found!");
    navigate("/"); // redirect to home
  }, [navigate]);

  return null;
}
