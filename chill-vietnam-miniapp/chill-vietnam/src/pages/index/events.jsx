import React, { useState, useEffect } from "react";
import { Text, Box, useNavigate, Icon } from "zmp-ui";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRecoilState } from "recoil";
import { EventDetailData } from "../../state";
import { fetchDataFromAPI } from "../../utils";

function Event() {
  const navigate = useNavigate();
  const [eventData, setEventData] = useRecoilState(EventDetailData);
  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    const apiUrl = "https://chillvietnam.vncrm.net/chillvietnam/getevents";
    const formdata = new FormData();
    formdata.append("license", "chillvietnam");

    fetch(apiUrl, {
      method: "POST",
      body: formdata,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == "OK") {
          setEventList(data.data);
        }
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
            justifyContent: "space-between",
            padding: "0 16px",
            alignItems: "baseline",
          }}
        >
          <Box flex style={{ alignItems: "center" }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 128 128"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="iconify iconify--noto"
            >
              <radialGradient
                id="a"
                cx="68.884"
                cy="124.296"
                r="70.587"
                gradientTransform="matrix(-1 -.00434 -.00713 1.6408 131.986 -79.345)"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset=".314" stop-color="#ff9800" />
                <stop offset=".662" stop-color="#ff6d00" />
                <stop offset=".972" stop-color="#f44336" />
              </radialGradient>
              <path
                d="M35.56 40.73c-.57 6.08-.97 16.84 2.62 21.42 0 0-1.69-11.82 13.46-26.65 6.1-5.97 7.51-14.09 5.38-20.18-1.21-3.45-3.42-6.3-5.34-8.29-1.12-1.17-.26-3.1 1.37-3.03 9.86.44 25.84 3.18 32.63 20.22 2.98 7.48 3.2 15.21 1.78 23.07-.9 5.02-4.1 16.18 3.2 17.55 5.21.98 7.73-3.16 8.86-6.14.47-1.24 2.1-1.55 2.98-.56 8.8 10.01 9.55 21.8 7.73 31.95-3.52 19.62-23.39 33.9-43.13 33.9-24.66 0-44.29-14.11-49.38-39.65-2.05-10.31-1.01-30.71 14.89-45.11 1.18-1.08 3.11-.12 2.95 1.5z"
                fill="url(#a)"
              />
              <radialGradient
                id="b"
                cx="64.921"
                cy="54.062"
                r="73.86"
                gradientTransform="matrix(-.0101 .9999 .7525 .0076 26.154 -11.267)"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset=".214" stop-color="#fff176" />
                <stop offset=".328" stop-color="#fff27d" />
                <stop offset=".487" stop-color="#fff48f" />
                <stop offset=".672" stop-color="#fff7ad" />
                <stop offset=".793" stop-color="#fff9c4" />
                <stop offset=".822" stop-color="#fff8bd" stop-opacity=".804" />
                <stop offset=".863" stop-color="#fff6ab" stop-opacity=".529" />
                <stop offset=".91" stop-color="#fff38d" stop-opacity=".209" />
                <stop offset=".941" stop-color="#fff176" stop-opacity="0" />
              </radialGradient>
              <path
                d="M76.11 77.42c-9.09-11.7-5.02-25.05-2.79-30.37.3-.7-.5-1.36-1.13-.93-3.91 2.66-11.92 8.92-15.65 17.73-5.05 11.91-4.69 17.74-1.7 24.86 1.8 4.29-.29 5.2-1.34 5.36-1.02.16-1.96-.52-2.71-1.23a16.09 16.09 0 0 1-4.44-7.6c-.16-.62-.97-.79-1.34-.28-2.8 3.87-4.25 10.08-4.32 14.47C40.47 113 51.68 124 65.24 124c17.09 0 29.54-18.9 19.72-34.7-2.85-4.6-5.53-7.61-8.85-11.88z"
                fill="url(#b)"
              />
            </svg>
            <Text.Title size="large" className="header-category">
              Danh sách sự kiện
            </Text.Title>
          </Box>
        </div>
        <React.Suspense fallback={<did>Đang lấy danh sách bài viết...</did>}>
          <Box ml={4}>
            <Box className="swiper">
              {eventList.map((event) => (
                <div
                  className="swiper-item"
                  key={event._id}
                  onClick={() => {
                    setEventData(event);
                    navigate("/eventdetail");
                  }}
                >
                  <Box>
                    <img className="w100 thumb" src={event.thumb} />
                    <Text className="cl-pink t-bold post-title">
                      {event.name}
                    </Text>
                    <Text className="cl-orange">{event.price}</Text>
                    <div className="line-space-post"></div>
                    <Text className="post-content">{event.content}</Text>
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

export default Event;
