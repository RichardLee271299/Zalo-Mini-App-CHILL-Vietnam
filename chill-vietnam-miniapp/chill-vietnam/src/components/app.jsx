import React from "react";
import { Route } from "react-router-dom";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import HomePage from "../pages/index";
import Transaction from "../pages/transaction";
import Booking from "../pages/booking";
import PostDetail from "../pages/detail/postdetail";
import EventDetail from "../pages/detail/eventdetail";
import MemberShip from "../pages/membership";
import TransactionDetail from "../pages/detail/transactiondetail";

const MyApp = () => {
  return (
    <RecoilRoot>
      <App>
        <SnackbarProvider>
          <ZMPRouter>
            <AnimationRoutes>
              <Route path="/" element={<HomePage></HomePage>}></Route>
              <Route
                path="/postdetail"
                element={<PostDetail></PostDetail>}
              ></Route>
              <Route
                path="/eventdetail"
                element={<EventDetail></EventDetail>}
              ></Route>
              <Route
                path="/booking-search"
                element={<Booking></Booking>}
              ></Route>
              <Route
                path="/transaction"
                element={<Transaction></Transaction>}
              ></Route>
              <Route
                path="/transactiondetail"
                element={<TransactionDetail></TransactionDetail>}
              ></Route>
              <Route path="/member" element={<MemberShip></MemberShip>}></Route>
            </AnimationRoutes>
          </ZMPRouter>
        </SnackbarProvider>
      </App>
    </RecoilRoot>
  );
};
export default MyApp;
