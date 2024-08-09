import logo from "./logo.svg";
import "./App.css";
import BasicTextFields from "./components/TextBox/TextBox";
import Date from "./components/Date/Date";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <BasicTextFields />
        <Date />
      </header>
    </div>
  );
}

export default App;
