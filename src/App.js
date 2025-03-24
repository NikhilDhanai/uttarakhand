import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChapterList from "./components/ChapterList";
import QuestionPage from "./components/QuestionPage";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChapterList />} />
        <Route path="/chapter/:chapterName" element={<QuestionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
