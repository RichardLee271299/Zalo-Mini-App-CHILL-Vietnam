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
function Featured() {
  const navigate = useNavigate();
  const [detailData, setDetailData] = useRecoilState(BarDetailData);
  const [featuredList, setFeaturedList] = useState([]);

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
        const postList = data.data.filter((item) => item.isFeatured == 0);
        setFeaturedList(postList);
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
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="iconify iconify--fxemoji"
          >
            <path
              fill="#FFD469"
              d="m391.765 115.993 75.102-74.385c3.189-3.158 8.463-2.639 10.975 1.08l17.325 25.649c2.386 3.533 1.177 8.355-2.594 10.344l-92.427 48.736a7.162 7.162 0 0 1-9.275-2.326 7.16 7.16 0 0 1 .894-9.098zm12.42 63.879a5.697 5.697 0 0 0 6.113 4.531l82.782-7.728a5.698 5.698 0 0 0 5.053-6.817l-4.939-24.129c-.716-3.498-4.436-5.484-7.741-4.131l-77.843 31.856a5.7 5.7 0 0 0-3.425 6.418zm-61.809-87.844a5.698 5.698 0 0 0 7.526-1.118l53.071-64a5.7 5.7 0 0 0-1.247-8.394L381.173 4.947c-2.98-1.967-7.015-.741-8.395 2.553L340.26 85.069a5.698 5.698 0 0 0 2.116 6.959zM218.4 479.836l-15.988 9.35c-12.996 7.6-29.692 3.226-37.292-9.77l-42.39-72.487c-7.6-12.996-3.226-29.692 9.77-37.292l15.988-9.35c12.996-7.6 29.692-3.226 37.292 9.77l42.39 72.487c7.601 12.996 3.226 29.692-9.77 37.292z"
            />
            <path
              fill="#842991"
              d="m120.402 408.701 154.911-84.34-105.898-165.808L29.384 262.586c-.903.577-38.751 35.207 2.814 100.288s88.204 45.827 88.204 45.827zm242.13-256.471c46.335 72.548 74.407 151.142 55.022 163.522-19.385 12.38-78.885-46.14-125.22-118.689S217.928 45.922 237.312 33.541s78.885 46.14 125.22 118.689z"
            />
            <ellipse
              transform="rotate(-32.567 301.337 191.289)"
              fill="#842991"
              cx="301.36"
              cy="191.299"
              rx="34.502"
              ry="73.109"
            />
            <path
              fill="#FFD469"
              d="M416.708 316.293c-16.932 10.814-74.444-48.976-120.779-121.525S219.534 44.896 236.466 34.082c.975-.623 2.069-1.034 3.264-1.261-7.988-.183-15.814 3.983-20.445 12.839-20.408 39.028-72.491 125.618-72.491 125.618s-25.845 34.8 19.588 105.935 89.296 62.233 89.296 62.233 99.643-10.179 143.424-12.27c10.365-.495 17.584-6.25 20.583-14.014-.796 1.31-1.781 2.367-2.977 3.131z"
            />
            <path d="M52.892 308.174a14.074 14.074 0 0 1-11.883-6.505c-4.187-6.556-2.267-15.264 4.289-19.451l57.911-36.986c6.555-4.186 15.264-2.267 19.451 4.289s2.267 15.264-4.289 19.451L60.46 305.958a14.018 14.018 0 0 1-7.568 2.216z" />
          </svg>
          <Text.Title size="large" className="header-category">
            Danh sách các quán bar
          </Text.Title>
        </div>
        <React.Suspense fallback={<did>Đang lấy danh sách bài viết...</did>}>
          <Box mx={4}>
            <Box className="post-wraper">
              {featuredList.map((post) => (
                <div
                  className="post-wraper-item"
                  key={post._id}
                  onClick={() => {
                    setDetailData(post);
                    navigate("/postdetail");
                  }}
                >
                  <Box>
                    <img className="w100 thumb" src={post.thumb} />
                    <Text className="cl-pink t-bold post-title">
                      {post.name}
                    </Text>
                    <Text className="cl-orange">{post.price}</Text>
                    <div className="line-space-post"></div>
                    <Text className="post-content">{post.content}</Text>
                    <Text.Title size="small" className="see-more">
                      Xem thêm <Icon size={20} icon="zi-arrow-right"></Icon>
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

export default Featured;
