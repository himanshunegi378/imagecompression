import { Routes, Route, Link } from 'react-router-dom'
import CompressView from './views/compress/Compress.View';
import { HomeView } from './views/home/Home.view';
import { ResizeView } from './views/resize/Resize.View';

function App() {


  return (
    <div className="App">
      <Routes>
        <Route path="/"  element={<HomeView />} />
        <Route path="/compress" element={<CompressView />} />
        <Route path="/resize" element={<ResizeView />} />
      </Routes>
    </div>
  );
}

export default App;
