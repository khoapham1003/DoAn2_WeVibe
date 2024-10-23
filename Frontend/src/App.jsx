import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import AppRoutes from "./components//Routes/Route";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="App">
        <AppRoutes />
      </div>
    </>
  );
}

export default App;
