import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import App from "./App.jsx";
import BuyerHome from "./buyer/BuyerHome.jsx";
import SellerDashboard from "./seller/SellerDashboard.jsx";
import SellerNewListing from "./seller/SellerNewListing.jsx";
import SellerListings from "./seller/SellerListings.jsx";
import SellerEditListing from "./seller/SellerEditListing.jsx";
import SellerInquiries from "./seller/SellerInquiries.jsx";
import AdminAccounts from "./admin/AdminAccounts.jsx";
import AdminPendingListings from "./admin/AdminPendingListings.jsx";
import AdminActivity from "./admin/AdminActivity.jsx";
import CarDetails from "./buyer/CarDetails.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      {/* หน้าแรก */}
      <Route path="/*" element={<App />} />

      {/* Buyer */}
      <Route path="/buyer" element={<BuyerHome />} />
      <Route path="/buyer/car/:id" element={<CarDetails />} />

      {/* Seller */}
      <Route path="/seller/dashboard" element={<SellerDashboard />} />
      <Route path="/seller/listings" element={<SellerListings />} />
      <Route path="/seller/listings/new" element={<SellerNewListing />} />
      <Route path="/seller/listings/edit/:id" element={<SellerEditListing />} />
      <Route path="/seller/inquiries" element={<SellerInquiries />} />

      {/* Admin */}
      <Route path="/admin" element={<Navigate to="/admin/accounts" />} />
      <Route path="/admin/accounts" element={<AdminAccounts />} />
      <Route path="/admin/pending" element={<AdminPendingListings />} />
      <Route path="/admin/activity" element={<AdminActivity />} />
    </Routes>
  </BrowserRouter>
);