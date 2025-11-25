import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


import App from "./App.jsx";
import BuyerHome from "./buyer/BuyerHome.jsx";
import SellerDashboard from "./seller/SellerDashboard.jsx";
import SellerNewListing from "./seller/SellerNewListing.jsx";
import SellerListings from "./seller/SellerListings.jsx";
import AdminPendingListings from "./admin/AdminPendingListings.jsx";
import CarDetails from "./buyer/CarDetails";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      {/* Home Page */}
      <Route path="/" element={<App/>} />

      {/* Buyer */}
      <Route path="/buyer" element={<BuyerHome />} />
      <Route path="/buyer/car/:id" element={<CarDetails />} />

      {/* Seller */}
      <Route path="/seller/listings/new" element={<SellerNewListing />} />
      <Route path="/seller/listings" element={<SellerListings />} />
      <Route path="/seller/dashboard" element={<SellerDashboard />} />

      {/* Admin */}
      <Route path="/admin" element={<Navigate to="/admin/pending" />} />
      <Route path="/admin/pending" element={<AdminPendingListings />} />

    </Routes>
  </BrowserRouter>
);


