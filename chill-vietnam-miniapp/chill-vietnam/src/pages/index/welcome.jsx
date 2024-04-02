import { useEffect, useState } from "react";
import { Text, Box, Avatar, useSnackbar, Sheet, Button } from "zmp-ui";
import logo from "../../static/logo-app.png";
import { getUserInfo, followOA } from "zmp-sdk/apis";
import { userInfoState, isShowFollowOA } from "../../state";
import { useRecoilState } from "recoil";

const WelcomePage = () => {
  const [userState, setUserState] = useRecoilState(userInfoState);
  const [showSheetFollow, setShowSheetFollow] = useRecoilState(isShowFollowOA);
  const [firstSheetVisible, setFirstSheetVisible] = useState(false);

  function handleFollowOA() {
    setShowSheetFollow(true);
    followOA({
      id: "1922989033741562663",
      success: (res) => {
        getUserInfo({
          success: (data) => {
            // xử lý khi gọi api thành công
            setUserState(data.userInfo);
          },
          fail: (error) => {
            // xử lý khi gọi api thất bại
            snackbar.openSnackbar({
              duration: 3000,
              text: error,
              type: "error",
            });
          },
        });
      },
      fail: (err) => {
        console.log("false", err);
      },
    });
  }

  useEffect(() => {
    getUserInfo({
      success: (data) => {
        // xử lý khi gọi api thành công
        setUserState(data.userInfo);
        // if (!showSheetFollow) {
        //   if (!data.userInfo.idByOA) {
        //     setFirstSheetVisible(true);
        //   }
        // }
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        snackbar.openSnackbar({
          duration: 3000,
          text: error,
          type: "error",
        });
      },
    });
  }, []);
  return (
    <Box className="header">
      <Box className="header-container">
        {userState && (
          <Avatar
            style={{ marginRight: 10 }}
            src={userState.avatar != "" ? userState.avatar : undefined}
          ></Avatar>
        )}
        <div className="flex-c">
          <Text size="Small" className="text-gray">
            Xin chào,
          </Text>
          <Text.Title size="Normal">
            {userState ? userState.name : "Không rõ"}
          </Text.Title>
        </div>
      </Box>

      {/* SHEET */}
      <Sheet visible={firstSheetVisible} autoHeight mask handler={false}>
        <Box style={{ padding: "30px 20px 10px 20px" }}>
          <img
            src={logo}
            style={{ width: 80, display: "block", margin: "0 auto" }}
          />
          <Text
            className="cl-black text-center"
            style={{
              fontWeight: "bolder",
              fontSize: 20,
              margin: "10px 0",
            }}
          >
            Quan tâm CHILL Vietnam
          </Text>

          <Text className="text-center" style={{ color: "#747373" }}>
            Hãy quan tâm CHILL Vietnam để nhận những ưu đãi mới nhất
          </Text>

          <Button
            style={{ marginTop: 40 }}
            fullWidth
            onClick={() => {
              setFirstSheetVisible(false);
              handleFollowOA();
            }}
          >
            Đã hiểu
          </Button>
        </Box>
      </Sheet>
    </Box>
  );
};

export const Welcome = WelcomePage;
