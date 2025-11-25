import { Routes, Route } from "react-router-dom";

import SellerDashboard from "./seller/SellerDashboard";
import SellerListings from "./seller/SellerListings";
import SellerNewListing from "./seller/SellerNewListing";
import SellerEditListing from "./seller/SellerEditListing";
import Login from "./Login";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/seller/dashboard" element={<SellerDashboard />} />
      <Route path="/seller/listings" element={<SellerListings />} />
      <Route path="/seller/listings/new" element={<SellerNewListing />} />
      <Route path="/seller/listings/edit/:id" element={<SellerEditListing />} />

      <Route path="/" element={<h1>Home Page</h1>} />
    </Routes>
  );
}
