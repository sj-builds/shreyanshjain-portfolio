import React from "react";
import ReactDOM from "react-dom/client";


import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";


import { App } from "./App";


import { Admin } from "@/pages/Admin";


import { VerifyContact } from "@/pages/VerifyContact";


import "./styles.css";




ReactDOM
  .createRoot(
    document.getElementById("root")!
  )
  .render(

    <React.StrictMode>


      <BrowserRouter>


        <Routes>



          {/* Public Portfolio */}

          <Route

            path="/"

            element={<App />}

          />






          {/* Email Verification */}

          <Route

            path="/verify-contact"

            element={<VerifyContact />}

          />






          {/* Private Admin Console */}

          <Route

            path="/admin"

            element={<Admin />}

          />






          {/* Fallback */}

          <Route

            path="*"

            element={
              <Navigate
                to="/"
                replace
              />
            }

          />



        </Routes>


      </BrowserRouter>


    </React.StrictMode>

  );