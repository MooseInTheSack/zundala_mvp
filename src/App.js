import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import BasicTextFields from "./components/TextBox/TextBox";
import Date from "./components/Date/Date";

function App() {
  const [dataFromChild, setDataFromChild] = useState("");

  function handleDataFromChild(data) {
    console.log("ducky data: ", data);
    setDataFromChild(data);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <BasicTextFields sendDataToParent={handleDataFromChild} />

        <Date />
      </header>
    </div>
  );
}

export default App;
