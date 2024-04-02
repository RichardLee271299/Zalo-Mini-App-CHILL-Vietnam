import { useEffect, useState } from "react";
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
  getStorage,
  setStorage,
  removeStorage,
  authorize,
  getSetting,
} from "zmp-sdk/apis";
import MyHeader from "../../components/myHeader";
import logo from "../../static/logo-app.png";
import {
  getPhoneNumberPromise,
  getAccessTokenPromise,
  fetchDataFromAPI,
  formatToVND,
} from "../../utils";

import { useRecoilValue, useRecoilState } from "recoil";
import { userInfoState, TransactionDetailID, CustomerID } from "../../state";
const MemberShip = () => {
  const user = useRecoilValue(userInfoState);
  const [transactionID, setTransactionID] = useRecoilState(TransactionDetailID);
  const [customerIDStorage, setCustomerIDStorage] = useRecoilState(CustomerID);
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const [phone, setPhone] = useState();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [filterBy, setFilterBy] = useState("year");
  const [filterVisible, setFilterVisible] = useState(false);
  const [cusID, setCusID] = useState();
  const [orderList, setOrderList] = useState([]);
  const [totalAmout, setTotalAmount] = useState(0);

  const [month, setMonth] = useState(() => {
    const d = new Date();
    return d.getMonth() + 1;
  });
  const [year, setYear] = useState(() => {
    const d = new Date();
    return d.getFullYear();
  });

  const [quarter, setQuarter] = useState(() => {
    const d = new Date();
    return Math.floor((d.getMonth() + 3) / 3);
  });

  function genMonth(number, prefix) {
    const data = [];

    for (let i = 0; i < number; i++) {
      data.push({
        value: i + 1,
        displayName: `${prefix} ${i + 1}`,
      });
    }
    return data;
  }
  function genYear() {
    const d = new Date();
    let year = d.getFullYear();
    const data = [];

    for (let i = 0; i < 5; i++) {
      data.push({
        key: 2020 + i,
        value: 2020 + i,
        displayName: `Năm ${2020 + i}`,
      });
    }
    return data;
  }
  function genQuarter() {
    const data = [];

    for (let i = 0; i < 4; i++) {
      data.push({
        key: i,
        value: i + 1,
        displayName: `Quý ${i + 1}`,
      });
    }
    return data;
  }

  function closeFilter() {
    if (filterBy == "month") {
      const input = document.querySelector("input.filter-month");
      const monthText = input.value.split(", ")[0].split(" ")[1]; //Lấy tháng từ input
      const yearText = input.value.split(", ")[1].split(" ")[1]; //Lấy năm từ input

      setMonth(parseInt(monthText));
      setYear(parseInt(yearText));
    } else if (filterBy == "quarter") {
      const input = document.querySelector("input.filter-quarter");
      const quarterText = input.value.split(", ")[0].split(" ")[1]; //Lấy tháng từ input
      const yearText = input.value.split(", ")[1].split(" ")[1]; //Lấy năm từ input

      setQuarter(parseInt(quarterText));
      setYear(parseInt(yearText));
    } else {
      const input = document.querySelector("input.filter-year");
      const yearText = input.value.split(" ")[1]; //Lấy năm từ input

      setYear(parseInt(yearText));
    }
  }

  useEffect(() => {
    getStorage({
      keys: ["user_phone"],
      success: (data) => {
        // xử lý khi gọi api thành công
        const { user_phone } = data;
        if (user_phone) {
          setPhone(user_phone);
        }
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        console.log(error);
      },
    });

    // removeStorage({
    //   keys: ["user_phone"],
    //   success: (data) => {
    //     // xử lý khi gọi api thành công
    //     const { errorKeys } = data;
    //   },
    //   fail: (error) => {
    //     // xử lý khi gọi api thất bại
    //     console.log(error);
    //   },
    // });
  }, []);

  useEffect(() => {
    getCustomerID();
  }, [phone]);

  useEffect(() => {
    getOrders();
    setCustomerIDStorage(cusID);
  }, [cusID]);

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

    fetch("https://chillvietnam.vncrm.net/chillvietnam/GetData", {
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
    console.log(cusID);

    const formdata = new FormData();
    formdata.append("customer_id", cusID);
    formdata.append("viewby", filterBy);
    formdata.append("month", month);
    formdata.append("year", year);
    formdata.append("quarter", quarter);
    formdata.append("license", "chillvietnam");

    fetch("https://chillvietnam.vncrm.net/chillvietnam/GetOrders", {
      method: "POST",
      body: formdata,
    })
      .then((response) => response.json())
      .then((data) => {
        setOrderList(data.data);
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
    <Page className="transaction-page" hideScrollbar={true}>
      <MyHeader title="Lịch sử chi tiêu" />
      <div className="hideline"></div>
      <div className="spacing-headerbar"></div>
      <Box
        flex
        style={{
          marginTop: 20,
          height: "90vh",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {phone ? (
          <>
            <Box
              flex
              className="filter-wrapper"
              onClick={() => setFilterVisible(true)}
            >
              <Icon icon="zi-clock-1"></Icon>
              <Text className="filter-value">
                {filterBy == "month"
                  ? `Tháng ${month}`
                  : filterBy == "quarter"
                  ? `Quý ${quarter}`
                  : ""}{" "}
                Năm {year}
              </Text>
            </Box>
            <Box
              flex
              style={{
                justifyContent: "right",
                padding: "10px 10px",
                margin: " 0 10px 10px 10px",
                color: "#333",
                alignItems: "baseline",
                backgroundColor: "#fff",
              }}
            >
              <Text style={{ marginRight: 4 }}>Tổng chi tiêu:</Text>
              <Text.Title style={{ color: "#842991" }}>
                {formatToVND(totalAmout)}
              </Text.Title>
            </Box>
            <Box className="orders">
              {orderList && orderList.length > 0 ? (
                orderList.map((order, index) => {
                  return (
                    <Box
                      key={index}
                      className="order-item"
                      onClick={() => {
                        setTransactionID(order.id);
                        navigate("/transactiondetail", {
                          replace: true,
                          animate: true,
                          direction: "forward",
                        });
                      }}
                    >
                      <Text className="order-bar-name">
                        {order.firt_product_name}
                      </Text>
                      <Text style={{ color: "#333" }}>
                        Ngày tạo: {order.create_date}
                      </Text>
                      <Box flex style={{ alignItems: "center" }}>
                        <Text style={{ color: "#333" }}>
                          Tổng tiền:{" "}
                          <span style={{ color: "#842991" }}>
                            {order.total_value_text} đ
                          </span>
                        </Text>
                        <Text
                          style={{
                            backgroundColor:
                              order.status == "Đã xử lý"
                                ? "green"
                                : order.status == "Đang xử lý"
                                ? "#842990"
                                : "#f58220",
                            width: "fit-content",
                            padding: "2px 6px",
                            borderRadius: 5,
                            marginLeft: "auto",
                            color: "white",
                            fontSize: 12,
                          }}
                        >
                          {order.status}
                        </Text>
                      </Box>
                    </Box>
                  );
                })
              ) : (
                <Text
                  style={{
                    fontSize: 14,
                    color: "#333",
                    marginTop: 20,
                    textAlign: "center",
                  }}
                >
                  Bạn không có giao dịch nào trong khoảng thời gian trên
                </Text>
              )}
            </Box>
          </>
        ) : (
          <Box
            style={{
              margin: "0px 16px 10px 16px",
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
        )}
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

      {/* Filter Sheet */}
      <Sheet
        className="filterSheet"
        visible={filterVisible}
        autoHeight
        mask
        handler={false}
        style={{ padding: "30px 14px 50px 14px" }}
      >
        <Box className="flex-space">
          <Text.Title>THỜI GIAN</Text.Title>
          <Text
            onClick={() => {
              getOrders();
              setFilterVisible(false);
            }}
            style={{ color: "#0068ff" }}
          >
            Xong
          </Text>
        </Box>

        <Box className="filter-item">
          <Box
            className="filter-item-icon-box"
            onClick={() => setFilterBy("month")}
          >
            {filterBy == "month" ? (
              <Icon style={{ color: "#5f0d69" }} icon="zi-radio-checked" />
            ) : (
              <Icon icon="zi-radio-unchecked" />
            )}
            <Text style={{ marginLeft: 10 }}>Xem theo tháng</Text>
          </Box>

          {filterBy == "month" && (
            <Box className="flex-space filter-item-month">
              <Picker
                placeholder={"Tháng " + month + ", Năm " + year}
                inputClass="filter-month"
                mask
                value={{ otp1: month, otp2: year }}
                title="Xem theo tháng"
                action={{
                  text: "Chọn xong",
                  close: true,
                  onClick: closeFilter,
                }}
                data={[
                  {
                    options: genMonth(12, "Tháng"),
                    name: "otp1",
                  },
                  {
                    options: genYear(),
                    name: "otp2",
                  },
                ]}
              />
              <Icon icon="zi-chevron-down"></Icon>
            </Box>
          )}
        </Box>

        <Box className="filter-item">
          <Box
            className="filter-item-icon-box"
            onClick={() => setFilterBy("quarter")}
          >
            {filterBy == "quarter" ? (
              <Icon style={{ color: "#5f0d69" }} icon="zi-radio-checked" />
            ) : (
              <Icon icon="zi-radio-unchecked" />
            )}
            <Text style={{ marginLeft: 10 }}>Xem theo quý</Text>
          </Box>

          {filterBy == "quarter" && (
            <Box className="flex-space filter-item-quarter">
              <Picker
                placeholder={"Quý " + quarter + ", Năm " + year}
                inputClass="filter-quarter"
                mask
                title="Xem theo quý"
                value={{ otp3: quarter, otp4: year }}
                action={{
                  text: "Chọn xong",
                  close: true,
                  onClick: closeFilter,
                }}
                data={[
                  {
                    options: genQuarter(),
                    name: "otp3",
                  },
                  {
                    options: genYear(),
                    name: "otp4",
                  },
                ]}
              />
              <Icon icon="zi-chevron-down"></Icon>
            </Box>
          )}
        </Box>

        <Box className="filter-item">
          <Box
            className="filter-item-icon-box"
            onClick={() => setFilterBy("year")}
          >
            {filterBy == "year" ? (
              <Icon style={{ color: "#5f0d69" }} icon="zi-radio-checked" />
            ) : (
              <Icon icon="zi-radio-unchecked" />
            )}
            <Text style={{ marginLeft: 10 }}>Xem theo năm</Text>
          </Box>

          {filterBy == "year" && (
            <Box className="flex-space filter-item-year">
              <Picker
                placeholder={"Năm " + year}
                inputClass="filter-year"
                mask
                value={{ otp5: year }}
                title="Xem theo năm"
                action={{
                  text: "Chọn xong",
                  close: true,
                  onClick: closeFilter,
                }}
                data={[
                  {
                    options: genYear(),
                    name: "otp5",
                  },
                ]}
              />
              <Icon icon="zi-chevron-down"></Icon>
            </Box>
          )}
        </Box>
      </Sheet>

      {/* End of Filter Sheet */}
    </Page>
  );
};
export default MemberShip;
