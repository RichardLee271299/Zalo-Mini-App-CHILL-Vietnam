import React, { useState, useEffect } from "react";
import { Text, Box, useNavigate, Icon } from "zmp-ui";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRecoilState } from "recoil";
import { BarDetailData } from "../../state";

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

function Recommend() {
  const navigate = useNavigate();
  const [detailData, setDetailData] = useRecoilState(BarDetailData);
  const [recommendList, setRecommendList] = useState([]);

  useEffect(() => {
    const apiUrl = "https://chillvietnam.vncrm.net/chillvietnam/getbars";
    const formdata = new FormData();
    formdata.append("license", "chillvietnam");

    fetch(apiUrl, {
      method: "POST",
      body: formdata,
    })
      .then((response) => response.json())
      .then((data) => {
        //Loc lại danh sách bar theo không nổi bật
        const postList = data.data.filter((item) => item.isFeatured == 1);
        setRecommendList(postList);
      })
      .catch((error) => {
        console.error("Lỗi:", error);
      });
  }, []);

  return (
    <div className="post-block">
      <Box>
        <div
          className="flex"
          style={{
            padding: "0 16px",
            alignItems: "center",
          }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 1048.9a2 2.5 0 1 1-4 0 2 2.5 0 1 1 4 0z"
              fill="#7f8c8d"
              transform="translate(0 -1028.4)"
            />
            <path
              d="M12 1030.4c-3.866 0-7 3.2-7 7.2 0 3.1 3.125 5.9 4 7.8.875 1.8 0 5 0 5l3-.5 3 .5s-.875-3.2 0-5c.875-1.9 4-4.7 4-7.8 0-4-3.134-7.2-7-7.2z"
              fill="#f39c12"
              transform="translate(0 -1028.4)"
            />
            <path
              d="M12 1030.4c3.866 0 7 3.2 7 7.2 0 3.1-3.125 5.9-4 7.8-.875 1.8 0 5 0 5l-3-.5v-19.5z"
              fill="#f1c40f"
              transform="translate(0 -1028.4)"
            />
            <path
              d="m9 1036.4-1 1 4 12 4-12-1-1-1 1-1-1-1 1-1-1-1 1-1-1zm0 1 1 1 .5-.5.5-.5.5.5.5.5.5-.5.5-.5.5.5.5.5 1-1 .438.4L12 1048.1l-3.438-10.3.438-.4z"
              fill="#e67e22"
              transform="translate(0 -1028.4)"
            />
            <path
              fill="#bdc3c7"
              d="M9 1045.4h6v5H9z"
              transform="translate(0 -1028.4)"
            />
            <path
              d="M9 1045.4v5h3v-1h3v-1h-3v-1h3v-1h-3v-1H9z"
              fill="#95a5a6"
              transform="translate(0 -1028.4)"
            />
            <path
              d="M9 1046.4v1h3v-1H9zm0 2v1h3v-1H9z"
              fill="#7f8c8d"
              transform="translate(0 -1028.4)"
            />
          </svg>
          <Text.Title size="large" className="header-category">
            Gợi ý cho bạn
          </Text.Title>
        </div>
        <React.Suspense fallback={<did>Đang lấy danh sách bài viết...</did>}>
          <Box mx={4}>
            <Box className="post-wraper">
              {recommendList.map((eventItem) => (
                <div
                  key={eventItem._id}
                  className="post-wraper-item"
                  onClick={() => {
                    setDetailData(eventItem);
                    navigate("/postdetail");
                  }}
                >
                  <Box>
                    <img className="w100 thumb" src={eventItem.thumb} />
                    <Text className="cl-pink t-bold post-title">
                      {eventItem.name}
                    </Text>
                    <Text className="cl-orange">{eventItem.price}</Text>
                    <div className="line-space-post"></div>
                    <Text className="post-content">{eventItem.content}</Text>
                    <Text.Title size="small" className="see-more">
                      Xem thêm <Icon size={18} icon="zi-arrow-right"></Icon>
                    </Text.Title>
                  </Box>
                </div>
              ))}
            </Box>
          </Box>
        </React.Suspense>
      </Box>
    </div>
  );
}

export default Recommend;
