import React from 'react';
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Up_Image from './Components/Upload_Image/Up_Image';
import ResultPage from './Components/ResultPage/ResultPage';



function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/" element={<Up_Image />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
