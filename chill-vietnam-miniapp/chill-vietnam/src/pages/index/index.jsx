import { getAccessToken, authorize, getSetting } from "zmp-sdk/apis";
import React, { useEffect } from "react";
import { Page, Box } from "zmp-ui";
import { Welcome } from "./welcome";
import NavPanel from "./navPanel";
import Recommend from "./recommendPost";
import Featured from "./featuredPost";
import Event from "./events";

const HomePage = () => {
  useEffect(() => {
    // getAccessToken({
    //   success: (accessToken) => {
    //     // xử lý khi gọi api thành công
    //     // console.log("Hello", accessToken);
    //   },
    //   fail: (error) => {
    //     // xử lý khi gọi api thất bại
    //     console.log(error);
    //   },
    // });
    // getSetting({
    //   success: (data) => {
    //     // xử lý khi gọi api thành công. Vd:
    //     // data.authSetting = {
    //     //   "scope.userInfo": true,
    //     //   "scope.userLocation": true
    //     // }
    //     console.log(data.authSetting);
    //     if (
    //       data.authSetting["scope.userInfo"] == false ||
    //       data.authSetting["scope.userPhonenumber"] == false
    //     ) {
    //       authorize({
    //         scopes: ["scope.userInfo", "scope.userPhonenumber"],
    //         success: (data) => {
    //           // xử lý khi gọi api thành công
    //           console.log(data);
    //         },
    //         fail: (error) => {
    //           // xử lý khi gọi api thất bại
    //           console.log(error);
    //         },
    //       });
    //     }
    //   },
    //   fail: (error) => {
    //     // xử lý khi gọi api thất bại
    //     console.log(error);
    //   },
    // });
  }, []);
  return (
    <Page hideScrollbar={true} className="page">
      <Welcome />
      <Box>
        <Box className="sphere-container">
          <Box className="sphere-main"></Box>
        </Box>
        <NavPanel />
        {/* <Social /> */}
        <div className="spacing"></div>
        <Event />
        <Recommend />
        <Featured />
      </Box>
    </Page>
  );
};

export default HomePage;
