import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import {
  getStorage,
  setStorage,
  requestSendNotification,
  authorize,
  getSetting,
} from "zmp-sdk/apis";
import { getPhoneNumberPromise, getAccessTokenPromise } from "../../utils";

import logo from "../../static/logo-app.png";
import {
  Page,
  Text,
  Box,
  Input,
  useNavigate,
  DatePicker,
  Sheet,
  Button,
  useSnackbar,
} from "zmp-ui";
import MyHeader from "../../components/myHeader";
import { userInfoState, BarDetailData } from "../../state";

// Module để gọi api
function fetchDataFromAPI(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

const PostDetail = () => {
  const navigate = useNavigate();
  const [dateBooking, setDateBooking] = useState(getCurrentDateFormatted());
  const [members, setMembers] = useState("");
  const snackbar = useSnackbar();
  const barData = useRecoilValue(BarDetailData);
  const userInfo = useRecoilValue(userInfoState);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [usrphone, setUsrPhone] = useState();

  useEffect(() => {
    getStorage({
      keys: ["user_phone"],
      success: (data) => {
        // xử lý khi gọi api thành công
        const { user_phone } = data;
        if (user_phone) {
          setUsrPhone(user_phone);
          console.log(user_phone);
        }
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        console.log(error);
      },
    });
  }, []);

  useEffect(() => {
    if (barData) {
      document.querySelector("#content").innerHTML = barData.content.replaceAll(
        "\r\n",
        " <br> "
      );
    }
  }, []);
  //Format lại dd/mm/yyyy khi booking
  function getCurrentDateFormatted() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }

  //Lưu thông tin booking
  function saveBooking(name, phone, members) {
    const apiUrl = "https://chillvietnam.vncrm.net/chillvietnam/savebooking";
    const formdata = new FormData();
    formdata.append("customerName", name);
    formdata.append("phone", phone);
    formdata.append("barName", barData.name);
    formdata.append("totalMember", members);
    formdata.append("bookingDate", dateBooking);
    formdata.append("license", "chillvietnam");

    fetch(apiUrl, {
      method: "POST",
      body: formdata,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == "OK") {
          snackbar.openSnackbar({
            duration: 3000,
            text: "Đặt bàn thành công, nhân viên sẽ liên hệ lại ngay với quý khách!",
            type: "success",
          });
          navigate("/", {
            replace: true,
            animate: true,
            direction: "backward",
          });
        } else {
          snackbar.openSnackbar({
            duration: 3000,
            text: "Đặt bàn không thành công",
            type: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi:", error.message);
      });
  }

  const handleBooking = () => {
    //Kiểm tra nếu chưa nhập thông tin thì hiện thông báo
    if (dateBooking == "" || members == "") {
      snackbar.openSnackbar({
        duration: 3000,
        text: "Vui lòng điền đầy đủ thông tin!",
        type: "warning",
      });
    } else {
      if (userInfo.idByOA != "") {
        requestSendNotification({
          success: () => {
            // xử lý khi gọi api thành công
          },
          fail: (error) => {
            // xử lý khi gọi api thất bại
            console.log(error);
          },
        });
      }
      saveBooking(userInfo.name, usrphone, members);
    }
  };

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

              setUsrPhone("0" + data.phone.substring(2));
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
  return (
    <Page hideScrollbar={true} className="postDetailPage">
      <MyHeader title="Trở về" />
      <div className="hideline"></div>
      <div className="spacing-headerbar"></div>
      <Box>
        {
          <React.Suspense fallback={<did>Đang lấy bài viết...</did>}>
            <Box>
              <img className="w100" src={barData.thumb} alt="hình ảnh" />
            </Box>
            <Box mt={4} mx={3}>
              <Text.Title size="xLarge" className="cl-orange">
                {barData.name}
              </Text.Title>

              {/* address */}
              <div className="flex post-address mt-10">
                <i
                  className="fa fa-map-marker"
                  style={{ color: "#842990" }}
                  aria-hidden="true"
                ></i>
                <Text>{barData.address}</Text>
              </div>
              {/* address */}
              {/* price */}
              <Text style={{ margin: "10px 0" }} className="cl-orange fz-20">
                {barData.price}
              </Text>
              {/* price */}

              {/* Booking FORM */}
              <Text.Title className="booking-title">ĐẶT BÀN</Text.Title>

              {usrphone ? (
                <Box className="form-container">
                  <div className="formItem">
                    <DatePicker
                      title="Chọn ngày"
                      dateFormat="dd/mm/yyyy"
                      onChange={(value, pickerValue) => {
                        setDateBooking(
                          `${
                            pickerValue.date >= 10
                              ? pickerValue.date
                              : `0${pickerValue.date}`
                          }/${
                            pickerValue.month >= 10
                              ? pickerValue.month
                              : `0${pickerValue.month}`
                          }/${pickerValue.year}`
                        );
                      }}
                    />
                  </div>

                  <div className="formItem">
                    <Input
                      type="tel"
                      placeholder="Số lượng khách"
                      value={members}
                      onChange={(e) => setMembers(e.target.value)}
                      className="formItem__input"
                    />
                  </div>

                  <button
                    onClick={() => {
                      handleBooking();
                    }}
                    className="btn-booking"
                  >
                    Gửi
                  </button>
                </Box>
              ) : (
                <Box
                  style={{
                    margin: "20px 10px 10px 10px",
                    borderRadius: 10,
                    backgroundColor: "#fff",
                    padding: 20,
                    textAlign: "center",
                    boxShadow: "0px 0px 18px #1414151f",
                  }}
                >
                  <Text style={{ color: "#333" }}>
                    Vui lòng cấp quyền truy cập số điện thoại để sử dụng tính
                    năng đặt bàn
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
              )}

              {/* CONTENT */}
              <Text.Title className="booking-title">GIỚI THIỆU</Text.Title>

              <Text id="content"></Text>
            </Box>
          </React.Suspense>
        }
      </Box>

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
            Cho phép <b>Chill VietNam</b> truy cập số điện thoại để liên lạc xác
            minh người dùng booking
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
};

export default PostDetail;
