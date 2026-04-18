import "./App.css";

import React, { useState } from "react";
import Navbar from "./components/Navbar";
import News from "./components/News";
import FakeNewsDetection from "./components/FakeNewsDetection";
import LoadingBar from "react-top-loading-bar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  const [query, setquery] = useState("world");
  const [progress, setprogress] = useState(10);

  return (
    <Router>
      <LoadingBar
        color="#a25e36"
        progress={progress}
        onLoaderFinished={() => setprogress(0)}
      />
      <Navbar querySelect={setquery} />
      <Routes>
        <Route exact path="/" element={<News query={query} setProgress={setprogress} />} />
        <Route exact path="/fake-news" element={<FakeNewsDetection />} />
      </Routes>
    </Router>
  );
};

export default App;
