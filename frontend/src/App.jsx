import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import './App.css'; // İçi boş olsa da dosya duruyorsa kalsın, hata vermesin.

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar'ı en üste koyuyoruz, her sayfada görünecek */}
        <Navbar />

        {/* Sayfaların değişeceği alan */}
        <Routes>
          {/* '/' adresine gidilince Home sayfasını göster */}
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;