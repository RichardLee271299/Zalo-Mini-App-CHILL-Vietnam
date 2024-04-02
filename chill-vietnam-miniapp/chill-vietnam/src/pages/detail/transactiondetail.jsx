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
} from "zmp-ui";
import { getStorage, setStorage, removeStorage } from "zmp-sdk/apis";
import MyHeader from "../../components/myHeader";
import logo from "../../static/logo-app.png";
import {
  getPhoneNumberPromise,
  getAccessTokenPromise,
  fetchDataFromAPI,
  formatToVND,
} from "../../utils";

import { useRecoilValue } from "recoil";
import { userInfoState, CustomerID, TransactionDetailID } from "../../state";

export default function TransactionDetail() {
  const [transactionData, setTransactionData] = useState();
  const cus_id = useRecoilValue(CustomerID);
  const order_id = useRecoilValue(TransactionDetailID);

  useEffect(() => {
    const apiUrl = "https://chillvietnam.vncrm.net/chillvietnam/GetOrderdetail";
    const formdata = new FormData();
    formdata.append("customer_id", cus_id);
    formdata.append("order_id", order_id);
    formdata.append("license", "chillvietnam");
    fetch(apiUrl, {
      method: "POST",
      body: formdata,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == "OK") {
          setTransactionData(data.order);
        }
      })
      .catch((error) => {
        console.error("Lỗi:", error);
      });
  }, []);
  return (
    <Page hideScrollbar={true} className="transactiondetail-page">
      <MyHeader title="Trở về" />
      <div className="hideline"></div>
      <div className="spacing-headerbar"></div>

      {transactionData ? (
        <Box className="transaction-container">
          <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
            <div className="retangle"></div>
            <b
              style={{
                display: "block",
                color: "#e3c08d",
                fontSize: 20,
                marginLeft: 6,
              }}
            >
              THÔNG TIN HÓA ĐƠN
            </b>
          </div>
          <Text.Title size="xLarge" className="transaction-title">
            {transactionData.items[0].product_name}
          </Text.Title>
          <Text>
            Số: <b>{transactionData.order_code}</b>
          </Text>
          <Text>
            Trạng thái:{" "}
            <b
              style={{
                color:
                  transactionData.status == "Đã xử lý"
                    ? "green"
                    : transactionData.status == "Đang xử lý"
                    ? "#e3c08d"
                    : "#f58220",
              }}
            >
              {transactionData.status}
            </b>
          </Text>
          <Text>
            Số người: <span>{transactionData.items[0].amount}</span> người
          </Text>
          <Text>
            Giá trị: <b> {transactionData.total_value_text} </b>đ
          </Text>
          <Text>
            Ngày tạo: <span> {transactionData.create_date} </span>
          </Text>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 10,
              marginTop: 20,
            }}
          >
            <div className="retangle"></div>
            <b
              style={{
                display: "block",
                color: "#e3c08d",
                fontSize: 20,
                marginLeft: 6,
              }}
            >
              HÌNH ẢNH HÓA ĐƠN
            </b>
          </div>
          <div className="receipt-container">
            {transactionData.receipt_image != "" ? (
              <img
                style={{ width: "100%" }}
                src={transactionData.receipt_image}
              />
            ) : (
              <Text style={{ color: "#000" }}>Chưa có hình ảnh hóa đơn</Text>
            )}
          </div>
        </Box>
      ) : null}
    </Page>
  );
}
