import { BrowserRouter, Route, Routes } from "react-router-dom";
import SchedulePage from "./components/SchedulePage/SchedulePage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SchedulePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
