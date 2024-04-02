import { getPhoneNumber, getAccessToken } from "zmp-sdk/apis";

export function fetchDataFromAPI(url) {
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
export function getPhoneNumberPromise() {
  return new Promise(async (resolve, reject) => {
    getPhoneNumber({
      success: async (data) => {
        let { token } = data;
        resolve(token);
      },
      fail: (error) => {
        reject(error.message);
      },
    });
  });
}

export function getAccessTokenPromise() {
  return new Promise(async (resolve, reject) => {
    getAccessToken({
      success: async (accessToken) => {
        resolve(accessToken);
      },
      fail: (error) => {
        reject(error.message);
      },
    });
  });
}
export function formatToVND(cost) {
  const formated = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(cost);
  return formated;
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
