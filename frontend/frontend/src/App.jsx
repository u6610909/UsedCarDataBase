import { Routes, Route } from "react-router-dom";

import Login from "./Login";

// Seller
import SellerDashboard from "./seller/SellerDashboard";
import SellerListings from "./seller/SellerListings";
import SellerNewListing from "./seller/SellerNewListing";
import SellerEditListing from "./seller/SellerEditListing";

// Buyer
import BuyerListings from "./buyer/BuyerListings";

// Admin
import AdminPending from "./admin/AdminPendingListings";

export default function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Seller */}
      <Route path="/seller/dashboard" element={<SellerDashboard />} />
      <Route path="/seller/listings" element={<SellerListings />} />
      <Route path="/seller/listings/new" element={<SellerNewListing />} />
      <Route path="/seller/listings/edit/:id" element={<SellerEditListing />} />

      {/* Buyer */}
      <Route path="/buyer" element={<BuyerListings />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminPending />} />

      {/* Default */}
      <Route path="/" element={<Login />} />
    </Routes>
  );
}
