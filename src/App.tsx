import { BurgerDetail, FriesDetail, Home, PachataDetail } from "@pages";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/burger/:id" element={<BurgerDetail />} />
      <Route path="/fries/:id" element={<FriesDetail />} />
      <Route path="/pachata/:id" element={<PachataDetail />} />
    </Routes>
  );
}

export default App;
