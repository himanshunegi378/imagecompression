import { Routes, Route } from "react-router-dom";
import { HomeView } from "./views/home/Home.view";
import { WorkBenchView } from "./views/workBench/WorkBench.view";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/workbench" element={<WorkBenchView />} />
      </Routes>
    </div>
  );
}

export default App;
