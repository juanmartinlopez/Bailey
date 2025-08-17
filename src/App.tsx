import {
  BurgerDetail,
  Cart,
  Checkout,
  Error,
  FriesDetail,
  Home,
  PachataDetail,
} from "@pages";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/burger/:id" element={<BurgerDetail />} />
      <Route path="/fries/:id" element={<FriesDetail />} />
      <Route path="/pachata/:id" element={<PachataDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default App;
