import { atom, selector } from "recoil";

export const userInfoState = atom({
  key: "userInfoState",
  default: {
    avatar: "",
    id: "",
    idByOA: undefined,
    isSensitive: false,
    name: "",
  },
});

export const isShowFollowOA = atom({
  key: "isShowFollowOA",
  default: false,
});

export const recommendPostState = atom({
  key: "recommendPostState",
  default: [],
});

export const BarDetailData = atom({
  key: "BarDetailData",
  default: {},
});
export const EventDetailData = atom({
  key: "EventDetailData",
  default: {},
});
export const TransactionDetailID = atom({
  key: "TransactionDetailID",
  default: "",
});
export const CustomerID = atom({
  key: "CustomerID",
  default: "",
});
