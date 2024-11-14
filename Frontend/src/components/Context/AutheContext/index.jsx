// useSessionCheck.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useSessionCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the session exists (replace 'accessToken' with your actual cookie name)
    const accessToken = getCookie("accessToken");

    if (!accessToken) {
      // If the session does not exist, navigate to the login page
      navigate("/login");
    }
  }, [navigate]);

  // Function to get the value of a cookie by name
  function getCookie(cookieName) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === cookieName) {
        return value;
      }
    }
    return null;
  }
};

export default useSessionCheck;
