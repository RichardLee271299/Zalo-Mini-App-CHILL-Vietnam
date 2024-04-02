import { useEffect, useState } from "react";
import "js-circle-progress";
import MyHeader from "../../components/myHeader";
import {
  getStorage,
  setStorage,
  removeStorage,
  authorize,
  getSetting,
} from "zmp-sdk/apis";
import {
  Box,
  Page,
  Text,
  Button,
  Sheet,
  useSnackbar,
  Icon,
  Picker,
  useNavigate,
} from "zmp-ui";
import {
  getPhoneNumberPromise,
  getAccessTokenPromise,
  fetchDataFromAPI,
  formatToVND,
} from "../../utils";
import { useRecoilValue } from "recoil";
import { userInfoState } from "../../state";
import { numberWithCommas } from "../../utils";
import logo from "../../static/logo-app.png";
export default function MemberShip() {
  const user = useRecoilValue(userInfoState);
  const [cusID, setCusID] = useState();
  const [phone, setPhone] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [rankPercent, setRankPercent] = useState("0");
  const [rankText, setRankText] = useState("Member");
  const [leftToNextRank, setLeftToNextRank] = useState(0);
  const navigate = useNavigate();
  const currentDate = new Date();
  useEffect(() => {
    getStorage({
      keys: ["user_phone"],
      success: (data) => {
        // xử lý khi gọi api thành công
        const { user_phone } = data;
        if (user_phone) {
          setPhone(user_phone);
          getCustomerID();
        }
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        console.log(error);
      },
    });
  }, []);

  useEffect(() => {
    getCustomerID();
  }, [phone]);

  useEffect(() => {
    getOrders();
  }, [cusID]);

  useEffect(() => {
    const point = Math.floor(totalAmount / 100000);
    let percent = 0;
    if (point < 100) {
      // Member
      percent = Math.floor((totalAmount / 10000000) * 100);
      setRankPercent(percent);
      setLeftToNextRank(100 - point);
      setRankText("Member");
    } else if (point >= 100 && point < 500) {
      //Bạc
      percent = Math.floor((totalAmount / 50000000) * 100);
      setRankPercent(percent);
      setLeftToNextRank(500 - point);
      setRankText("Silver");
    } else if (point >= 500 && point < 1000) {
      //Vàng
      percent = Math.floor((totalAmount / 100000000) * 100);
      setRankPercent(percent);
      setLeftToNextRank(1000 - point);
      setRankText("Gold");
    } else {
      setRankText("Diamond");
    }
  }, [totalAmount]);

  function doGetPhone() {
    getSetting({
      success: (data) => {
        // xử lý khi gọi api thành công. Vd:
        // data.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
        if (data.authSetting["scope.userPhonenumber"] == false) {
          authorize({
            scopes: ["scope.userInfo", "scope.userPhonenumber"],
            success: (data) => {
              // xử lý khi gọi api thành công
              if (data["scope.userPhonenumber"]) {
                getPhoneFromServer();
              }
            },
            fail: (error) => {
              // xử lý khi gọi api thất bại
              console.log(error);
            },
          });
        }
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        console.log(error);
      },
    });
  }

  function getPhoneFromServer() {
    // Nếu nhập rồi thì thực hiện call API lấy phone
    Promise.all([getPhoneNumberPromise(), getAccessTokenPromise()]).then(
      ([token, accessToken]) => {
        const formdata = new FormData();
        formdata.append("accessToken", accessToken);
        formdata.append("token", token);
        formdata.append("secret", "chillvietnam");

        fetch("https://zalotoken.vnsign.net/GetPhoneNumber", {
          method: "POST",
          body: formdata,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data.status);
            if (data.status == "OK") {
              console.log("Vô trong luôn", "0" + data.phone.substring(2));
              setStorage({
                data: {
                  user_phone: "0" + data.phone.substring(2),
                },
                success: (data) => {
                  // xử lý khi gọi api thành công
                  const { errorKeys } = data;
                  console.log(errorKeys);
                  console.log("Lưu phone vào local storage thành công");
                },
                fail: (error) => {
                  // xử lý khi gọi api thất bại
                  console.log(error);
                },
              });

              setPhone("0" + data.phone.substring(2));
            } else {
              snackbar.openSnackbar({
                duration: 3000,
                text: response.message,
                type: "error",
              });
            }
          })
          .catch((err) => {});
      }
    );
  }

  function getCustomerID() {
    const formdata = new FormData();
    formdata.append("zaloid", user.id);
    formdata.append("phone", phone);
    formdata.append("license", "chillvietnam");

    fetch("https://vndc.vncrm.net/ZaloMiniApp/GetData", {
      method: "POST",
      body: formdata,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.found == 1) {
          setCusID(data.customer_id);
        }
      })
      .catch((error) => {
        console.error("Lỗi:", error);
      });
  }

  function getOrders() {
    const now = new Date();

    const formdata = new FormData();
    formdata.append("customer_id", cusID);
    formdata.append("viewby", "year");
    formdata.append("year", now.getFullYear());
    formdata.append("license", "chillvietnam");

    fetch("https://chillvietnam.vncrm.net/chillvietnam/GetOrders", {
      method: "POST",
      body: formdata,
    })
      .then((response) => response.json())
      .then((data) => {
        const totalCast = data.data.reduce((total, current) => {
          return (total += current.total_value);
        }, 0);

        setTotalAmount(totalCast);
      })
      .catch((error) => {
        console.error("Lỗi:", error);
      });
  }

  return (
    <Page className="member-page">
      <MyHeader title="Thông tin thành viên" />
      <div className="hideline"></div>
      <div className="spacing-headerbar"></div>
      {!phone ? (
        <Box
          style={{
            margin: "20px 16px 10px 16px",
            borderRadius: 10,
            backgroundColor: "#fff",
            padding: 20,
            textAlign: "center",
            boxShadow: "0px 0px 18px #1414151f",
          }}
        >
          <Text style={{ color: "#333" }}>
            Vui lòng cấp quyền truy cập số điện thoại để sử dụng tính năng này
          </Text>
          <Button
            style={{
              height: 40,
              display: "flex",
              alignItems: "center",
              margin: "10px auto 0 auto",
              backgroundColor: "#842991",
            }}
            onClick={() => setSheetVisible(true)}
          >
            Cấp quyền truy cập số điện thoại
          </Button>
        </Box>
      ) : (
        <>
          <Box className="progress-wrapper">
            <Box mb={4} style={{ textAlign: "center" }}>
              <b style={{ fontSize: 17, color: "#333" }}>Hạng thành viên</b>
              <Text
                className={
                  rankText == "Silver"
                    ? "membership-class member-silver"
                    : rankText == "Gold"
                    ? "membership-class member-gold"
                    : rankText == "Diamond"
                    ? "membership-class member-diamond"
                    : "membership-class member-normal"
                }
              >
                {rankText}
              </Text>
            </Box>

            <circle-progress
              text-format="percent"
              value={rankPercent}
              max="100"
              animation-duration="1000"
            ></circle-progress>

            <Box
              flex
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginTop: 14,
              }}
            >
              <Box flex style={{ alignItems: "center", marginBottom: 6 }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 128 128"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="iconify iconify--noto"
                >
                  <circle cx="64" cy="66.58" r="57.36" fill="#d68f30" />
                  <path
                    d="M10.54 81.48v5.86c.6 1.55 1.27 3.08 2 4.56V81.48h-2zm6.54 11.03v7.04c.8 1.13 1.63 2.24 2.5 3.31V92.51h-2.5zm8.66 9.2v7.59c.97.87 1.97 1.7 3 2.5v-10.09h-3zm10.66 6.99v8.16c.98.54 1.98 1.05 3 1.54v-9.7h-3zm12.09 4.45v8.64c.99.28 1.99.53 3 .76v-9.4h-3zm14.15 1.54v9.21c.45.01.9.03 1.36.03.55 0 1.1-.03 1.64-.04v-9.2h-3zm14.15-1.61v9.4c1.01-.23 2.01-.49 3-.77v-8.63h-3zm12.06-4.51v9.71c1.02-.49 2.02-1.02 3-1.57v-8.14h-3zm10.63-7.05v10.1a55.52 55.52 0 0 0 3-2.52v-7.58h-3zm11.61-9.23h-2.5v10.35c.87-1.08 1.71-2.19 2.5-3.33v-7.02zm6.5-11.07h-2v10.44c.73-1.51 1.4-3.06 2-4.63v-5.81z"
                    fill="#bc6f00"
                  />
                  <circle cx="64" cy="61.42" r="57.36" fill="#fff176" />
                  <circle cx="64" cy="61.42" r="52.25" fill="#f2bc1a" />
                  <path
                    d="M11.65 63.42c-.37-6.88.82-13.86 3.22-20.4 2.5-6.52 6.33-12.55 11.16-17.67C35.73 15.09 49.81 9.14 64 9.07c14.19.08 28.28 6.02 37.96 16.29 4.84 5.11 8.66 11.15 11.16 17.66 2.41 6.55 3.6 13.52 3.22 20.4h-.2a52.756 52.756 0 0 0-4-20 52.834 52.834 0 0 0-11.29-16.97 52.255 52.255 0 0 0-16.9-11.38 51.805 51.805 0 0 0-39.92 0 52.255 52.255 0 0 0-16.9 11.38 52.671 52.671 0 0 0-11.29 16.97 52.756 52.756 0 0 0-4 20h-.19z"
                    fill="#e08f00"
                  />
                  <path
                    d="M64 4.07c-31.68 0-57.36 25.68-57.36 57.36S32.32 118.79 64 118.79s57.36-25.68 57.36-57.36S95.68 4.07 64 4.07zm0 109.61c-28.86 0-52.25-23.39-52.25-52.25C11.75 32.56 35.14 9.17 64 9.17s52.25 23.39 52.25 52.25S92.86 113.68 64 113.68z"
                    fill="#fff176"
                  />
                  <path
                    fill="#d38200"
                    d="m37.99 21.35 1.27 3.93 4.14-1.58v1.58l-3.35 2.43 1.28 2.34v1.59l-3.34-2.43-3.35 2.43v-1.59l1.28-2.34-3.34-2.43V23.7l4.13 1.58zM22.01 43.91l1.28 3.93 4.13-1.58v1.58l-3.34 2.43 1.28 2.35v1.58l-3.35-2.43-3.34 2.43v-1.58l1.28-2.35-3.35-2.43v-1.58l4.14 1.58zm-.47 27.81 1.28 3.93 4.13-1.58v1.58l-3.34 2.43 1.28 2.35v1.58l-3.35-2.43-3.34 2.43v-1.58l1.28-2.35-3.35-2.43v-1.58l4.14 1.58zM38.6 93.8l1.28 3.93 4.13-1.58v1.58l-3.34 2.43 1.28 2.34v1.59l-3.35-2.43-3.34 2.43v-1.59l1.28-2.34-3.35-2.43v-1.58l4.14 1.58zm51.41-72.45-1.27 3.93-4.14-1.58v1.58l3.35 2.43-1.28 2.34v1.59l3.34-2.43 3.35 2.43v-1.59l-1.28-2.34 3.34-2.43V23.7l-4.13 1.58zm15.98 22.56-1.28 3.93-4.13-1.58v1.58l3.34 2.43-1.28 2.35v1.58l3.35-2.43 3.34 2.43v-1.58l-1.28-2.35 3.35-2.43v-1.58l-4.14 1.58zm.47 27.81-1.28 3.93-4.13-1.58v1.58l3.34 2.43-1.28 2.35v1.58l3.35-2.43 3.34 2.43v-1.58l-1.28-2.35 3.35-2.43v-1.58l-4.14 1.58zM89.4 93.8l-1.28 3.93-4.13-1.58v1.58l3.34 2.43-1.28 2.34v1.59l3.35-2.43 3.34 2.43v-1.59l-1.28-2.34 3.35-2.43v-1.58l-4.14 1.58z"
                  />
                  <path
                    d="m89.4 92.21 1.27 3.93h4.14l-3.35 2.43 1.28 3.93-3.34-2.43-3.35 2.43 1.28-3.93-3.34-2.43h4.13zm17.06-22.07 1.27 3.93h4.14l-3.35 2.43 1.28 3.93-3.34-2.43-3.35 2.43 1.28-3.93-3.34-2.43h4.13zm-.47-27.81 1.27 3.93h4.14l-3.35 2.43 1.28 3.93-3.34-2.43-3.35 2.43 1.28-3.93-3.34-2.43h4.13zM90.01 19.76l1.28 3.93h4.13l-3.34 2.43 1.28 3.93-3.35-2.43-3.34 2.43 1.28-3.93-3.35-2.43h4.14z"
                    fill="#fff176"
                  />
                  <path
                    fill="#d38200"
                    d="m64.05 102.5 1.28 3.93 4.13-1.58v1.58l-3.34 2.43 1.28 2.35v1.58l-3.35-2.43-3.34 2.43v-1.58l1.28-2.35-3.35-2.43v-1.58l4.14 1.58z"
                  />
                  <path
                    fill="#fff176"
                    d="m64.05 100.4 1.28 3.93h4.13l-3.34 2.43 1.28 3.93-3.35-2.43-3.34 2.43 1.28-3.93-3.35-2.43h4.14z"
                  />
                  <path
                    fill="#d38200"
                    d="m64.05 12.89 1.28 3.93 4.13-1.58v1.58l-3.34 2.43 1.28 2.35v1.58l-3.35-2.43-3.34 2.43V21.6l1.28-2.35-3.35-2.43v-1.58l4.14 1.58z"
                  />
                  <path
                    fill="#fff176"
                    d="m64.05 11.31 1.28 3.93h4.13l-3.34 2.43 1.28 3.93-3.35-2.43-3.34 2.43 1.28-3.93-3.35-2.43h4.14zM38.6 92.21l-1.27 3.93h-4.14l3.35 2.43-1.28 3.93 3.34-2.43 3.35 2.43-1.28-3.93 3.34-2.43h-4.13zM21.54 70.14l-1.27 3.93h-4.14l3.35 2.43-1.28 3.93L21.54 78l3.35 2.43-1.28-3.93 3.34-2.43h-4.13zm.47-27.81-1.27 3.93H16.6l3.35 2.43-1.28 3.93 3.34-2.43 3.35 2.43-1.28-3.93 3.34-2.43h-4.13zm15.98-22.57-1.28 3.93h-4.13l3.34 2.43-1.28 3.93 3.35-2.43 3.34 2.43-1.28-3.93 3.35-2.43h-4.14z"
                  />
                  <path
                    d="M95.22 48.2c0-.35-62.38 0-62.38 0l-.56 1.68v2.87c0 .52.42.94.94.94h61.56c.52 0 .94-.42.94-.94v-2.79l-.5-1.76zm.09 37.3H33.1l-4.16 2.09.05 2.69c.01.29.25.53.55.53h68.93c.29 0 .54-.23.55-.53l.05-2.64-3.76-2.14z"
                    fill="#d38200"
                  />
                  <path
                    d="M43.13 77.32h-3.58c-.59 0-1.07-1.86-1.07-2.45l5.71-.18c0 .59-.48 2.63-1.06 2.63zm1.22-19.31h-6.03c-.45 0-.84-.3-.97-.73l-.47-3.93h8.83l-.4 3.93c-.12.43-.51.73-.96.73zm-6.03 20.5h6.03c.45 0 1.34.28 1.46.71 0 0-.03 1.87-.03 2.61s-.3 1.28-.97 1.28h-6.95c-.67 0-.97-.6-.97-1.28s-.03-2.59-.03-2.59c.13-.43 1.01-.73 1.46-.73zm51.31-1.19h-3.58c-.59 0-1.07-1.86-1.07-2.45l5.71-.18c0 .59-.47 2.63-1.06 2.63zm1.22-19.31h-6.03c-.45 0-.84-.3-.97-.73l-.47-3.93h8.83l-.4 3.93c-.12.43-.51.73-.96.73zm-6.03 20.5h6.03c.45 0 1.34.28 1.46.71 0 0-.03 1.87-.03 2.61s-.3 1.28-.97 1.28h-6.95c-.67 0-.97-.6-.97-1.28s-.03-2.59-.03-2.59c.13-.43 1.01-.73 1.46-.73zm-10.69-1.19h-3.58c-.59 0-1.07-1.86-1.07-2.45l5.71-.18c0 .59-.47 2.63-1.06 2.63zm1.22-19.31h-6.03c-.45 0-.84-.3-.97-.73l-.47-3.93h8.83l-.4 3.93c-.12.43-.51.73-.96.73zm-6.03 20.5h6.03c.45 0 1.34.28 1.46.71 0 0-.03 1.87-.03 2.61s-.3 1.28-.97 1.28h-6.95c-.67 0-.97-.6-.97-1.28s-.03-2.59-.03-2.59c.13-.43 1.01-.73 1.46-.73zm-10.69-1.19h-3.58c-.59 0-1.07-1.86-1.07-2.45l5.71-.18c0 .59-.47 2.63-1.06 2.63zm1.22-19.31h-6.03c-.45 0-.84-.3-.97-.73l-.47-3.93h8.83l-.4 3.93c-.12.43-.51.73-.96.73zm-6.03 20.5h6.03c.45 0 1.34.28 1.46.71 0 0-.03 1.87-.03 2.61s-.3 1.28-.97 1.28h-6.95c-.67 0-.97-.6-.97-1.28s-.03-2.59-.03-2.59c.13-.43 1.01-.73 1.46-.73z"
                    fill="#d38200"
                  />
                  <path
                    d="M95.67 45.52c0-.35-.18-.68-.45-.84l-31.18-17.7-31.22 17.68c-.3.18-.49.51-.49.86l-.05 4.37c0 .55.45 1 1 1h61.43c.55 0 1-.45 1-1l-.04-4.37z"
                    fill="#fff176"
                  />
                  <path fill="#f2bc1a" d="M87.84 44.33 64 30.8 40.16 44.33z" />
                  <path
                    fill="#fff176"
                    d="M79.07 42.68 64 34.12l-15.07 8.56zm14.32 39.34H34.61c-.58 0-1.13.25-1.52.68l-4.04 4.51c-.28.31-.06.8.36.8h69.18c.41 0 .63-.49.36-.8L94.9 82.7c-.38-.43-.94-.68-1.51-.68zm-3.76-6.51h-3.58c-.59 0-1.07-.48-1.07-1.07V58.46c0-.59.48-1.07 1.07-1.07h3.58c.59 0 1.07.48 1.07 1.07v15.99c0 .59-.48 1.06-1.07 1.06zm1.23-19.31h-6.03c-.45 0-.84-.3-.97-.73l-.46-1.59c-.19-.64.3-1.28.97-1.28h6.95c.67 0 1.15.64.97 1.28l-.46 1.59c-.13.43-.53.73-.97.73zm-6.04 20.51h6.03c.45 0 .84.3.97.73l.46 1.59c.19.64-.3 1.28-.97 1.28h-6.95c-.67 0-1.15-.64-.97-1.28l.46-1.59c.13-.44.53-.73.97-.73zm-41.69-1.2h-3.58c-.59 0-1.07-.48-1.07-1.07V58.46c0-.59.48-1.07 1.07-1.07h3.58c.59 0 1.07.48 1.07 1.07v15.99c-.01.59-.49 1.06-1.07 1.06zm1.22-19.31h-6.03c-.45 0-.84-.3-.97-.73l-.46-1.59c-.19-.64.3-1.28.97-1.28h6.95c.67 0 1.15.64.97 1.28l-.46 1.59c-.13.43-.52.73-.97.73zm-6.03 20.51h6.03c.45 0 .84.3.97.73l.46 1.59c.19.64-.3 1.28-.97 1.28h-6.95c-.67 0-1.15-.64-.97-1.28l.46-1.59c.13-.44.52-.73.97-.73zm20.31-1.2h-3.58c-.59 0-1.07-.48-1.07-1.07V58.46c0-.59.48-1.07 1.07-1.07h3.58c.59 0 1.07.48 1.07 1.07v15.99a1.07 1.07 0 0 1-1.07 1.06zm1.22-19.31h-6.03c-.45 0-.84-.3-.97-.73l-.46-1.59c-.19-.64.3-1.28.97-1.28h6.95c.67 0 1.15.64.97 1.28l-.46 1.59c-.13.43-.52.73-.97.73zm-6.03 20.51h6.03c.45 0 .84.3.97.73l.46 1.59c.19.64-.3 1.28-.97 1.28h-6.95c-.67 0-1.15-.64-.97-1.28l.46-1.59c.13-.44.52-.73.97-.73zm20.31-1.2h-3.58c-.59 0-1.07-.48-1.07-1.07V58.46c0-.59.48-1.07 1.07-1.07h3.58c.59 0 1.07.48 1.07 1.07v15.99a1.07 1.07 0 0 1-1.07 1.06zm1.22-19.31h-6.03c-.45 0-.84-.3-.97-.73l-.46-1.59c-.19-.64.3-1.28.97-1.28h6.95c.67 0 1.15.64.97 1.28l-.46 1.59c-.13.43-.52.73-.97.73zm-6.03 20.51h6.03c.45 0 .84.3.97.73l.46 1.59c.19.64-.3 1.28-.97 1.28h-6.95c-.67 0-1.15-.64-.97-1.28l.46-1.59c.13-.44.53-.73.97-.73z"
                  />
                </svg>
                <Text className="currentCost">
                  {numberWithCommas(Math.floor(totalAmount / 100000))}
                </Text>
              </Box>
              {leftToNextRank == -1 ? (
                <Text>Bạn đã đạt thứ hạng cao nhất!</Text>
              ) : (
                <Text>
                  Bạn cần <b>{numberWithCommas(leftToNextRank)} điểm</b> để lên
                  hạng!
                </Text>
              )}

              <Box style={{ marginTop: 6, textAlign: "center" }}>
                <Text>
                  Bạn đã chi tiêu: <b>{formatToVND(totalAmount)}</b> qua CHILL
                  Vietnam <br /> năm <b>{currentDate.getFullYear()}</b>
                </Text>
              </Box>
            </Box>
          </Box>

          {/* END OF PROGRESS */}

          <Box mt={4} mx={3}>
            {/* ƯU đãi thứ hạng */}
            {/* <Box
          className="reward-list"
          flex
          style={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Box
            flex
            style={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1037.4v12c0 1.1.895 2 2 2h18c1.105 0 2-.9 2-2v-12H1z"
                fill="#f39c12"
                transform="translate(0 -1028.4)"
              />
              <path
                d="M1 1036.4v12c0 1.1.895 2 2 2h18c1.105 0 2-.9 2-2v-12H1z"
                fill="#f1c40f"
                transform="translate(0 -1028.4)"
              />
              <path
                d="M2 1034.4c-1.105 0-2 .9-2 2v2h24v-2c0-1.1-.895-2-2-2H2z"
                fill="#f1c40f"
                transform="translate(0 -1028.4)"
              />
              <path
                fill="#e74c3c"
                d="M9 1033.4h6v18H9z"
                transform="translate(0 -1028.4)"
              />
              <path
                d="M7.885 1029.4c-.999-.1-1.973.4-2.508 1.2-.778 1.2-.313 2.7 1.034 3.4.433.3.897.4 1.364.4h8.447c.467 0 .942-.1 1.375-.4 1.347-.7 1.801-2.2 1.023-3.4-.777-1.2-2.492-1.6-3.839-.9-.433.2-.773.5-1.011.9h-.022c-.032.1-.06.1-.088.2l-1.661 2.5-1.661-2.5c-.028-.1-.056-.1-.088-.2h-.022a2.22 2.22 0 0 0-1.001-.9c-.421-.2-.888-.3-1.342-.3zm-.165 1.2c.27 0 .55.1.803.2.085 0 .16.1.23.1.05.1.09.1.133.2h.033c.022 0 .046.1.066.1h.043c.017.1.042.1.056.1l1.166 1.8H7.566c-.064 0-.124 0-.187-.1-.09 0-.18 0-.264-.1-.169 0-.319-.2-.43-.3-.33-.4-.379-.9-.087-1.4.243-.3.67-.6 1.122-.6zm8.568 0c.451 0 .879.3 1.122.6.292.5.232 1-.099 1.4-.11.1-.249.3-.418.3-.084.1-.174.1-.264.1-.062.1-.134.1-.198.1h-2.683l1.165-1.8c.014 0 .039 0 .055-.1h.011c.003 0-.002 0 0 0h.033c.02 0 .044-.1.066-.1h.033c.042-.1.094-.1.143-.2.071 0 .147-.1.231-.1.253-.1.533-.2.803-.2z"
                fill="#c0392b"
                transform="translate(0 -1028.4)"
              />
              <path
                fill="#f39c12"
                d="M1 1038.4h22v3H1z"
                transform="translate(0 -1028.4)"
              />
              <path
                fill="#c0392b"
                d="M9 1038.4h6v3H9zM9 1050.4h6v1H9z"
                transform="translate(0 -1028.4)"
              />
              <path
                fill="#e67e22"
                d="M1 1038.4h8v1H1zM15 1038.4h8v1h-8z"
                transform="translate(0 -1028.4)"
              />
            </svg>

            <Text style={{ marginLeft: 8 }}>Ưu đãi thứ hạng</Text>
          </Box>

          <Icon icon="zi-chevron-right"></Icon>
        </Box> */}

            {/* End of Ưu đãi thứ hạng */}

            {/* Lịch sử chi tiêu */}

            <Box
              onClick={() => {
                navigate("/transaction", {
                  animate: true,
                  direction: "forward",
                });
              }}
              flex
              style={{
                alignItems: "center",
                margin: "0 auto",
                backgroundColor: "#842991",
                width: "fit-content",
                padding: "10px 16px",
                color: "#fff",
                borderRadius: 8,
              }}
            >
              <svg
                fill="#fff"
                width="20"
                height="20"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M504 255.531c.253 136.64-111.18 248.372-247.82 248.468-59.015.042-113.223-20.53-155.822-54.911-11.077-8.94-11.905-25.541-1.839-35.607l11.267-11.267c8.609-8.609 22.353-9.551 31.891-1.984C173.062 425.135 212.781 440 256 440c101.705 0 184-82.311 184-184 0-101.705-82.311-184-184-184-48.814 0-93.149 18.969-126.068 49.932l50.754 50.754c10.08 10.08 2.941 27.314-11.313 27.314H24c-8.837 0-16-7.163-16-16V38.627c0-14.254 17.234-21.393 27.314-11.314l49.372 49.372C129.209 34.136 189.552 8 256 8c136.81 0 247.747 110.78 248 247.531zm-180.912 78.784 9.823-12.63c8.138-10.463 6.253-25.542-4.21-33.679L288 256.349V152c0-13.255-10.745-24-24-24h-16c-13.255 0-24 10.745-24 24v135.651l65.409 50.874c10.463 8.137 25.541 6.253 33.679-4.21z" />
              </svg>
              <Text style={{ marginLeft: 8 }}>Lịch sử chi tiêu</Text>
            </Box>

            {/* End of lịch sử chi tiêu */}
          </Box>
        </>
      )}
      {/* SHEET */}

      <Sheet
        visible={sheetVisible}
        // onClose={() => setSheetVisible(false)}
        autoHeight
        mask
        handler={false}
      >
        <Box style={{ padding: "30px 20px 10px 20px" }}>
          <img
            src={logo}
            style={{ width: 80, display: "block", margin: "0 auto" }}
          />
          <Text
            className="cl-black text-center"
            style={{
              fontWeight: "bolder",
              fontSize: 18,
              margin: "10px 0",
            }}
          >
            Tính năng cần truy cập số điện thoại
          </Text>

          <Text className="text-center" style={{ color: "#747373" }}>
            Cho phép <b>Chill VietNam</b> truy cập số điện thoại để định danh
            người dùng
          </Text>

          <Button
            style={{ marginTop: 40 }}
            fullWidth
            onClick={() => {
              setSheetVisible(false);
              doGetPhone();
            }}
          >
            Đã hiểu
          </Button>
        </Box>
      </Sheet>
    </Page>
  );
}
