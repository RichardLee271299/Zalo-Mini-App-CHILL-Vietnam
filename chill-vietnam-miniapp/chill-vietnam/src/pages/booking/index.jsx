import { useEffect, useMemo, useState } from "react";
import { Box, Page, useNavigate, useSnackbar } from "zmp-ui";
import SearchHeader from "../../components/search-header";
import SearchItem from "./search-item";

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

function Booking() {
  const [posts, setPosts] = useState([]);
  const [searchposts, setSearchPosts] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const navigate = useNavigate();
  const snackbar = useSnackbar();

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
        setPosts(data.data);
        setSearchPosts(data.data);
      })
      .catch((error) => {
        snackbar.openSnackbar({
          duration: 3000,
          text: error.message,
          type: "error",
        });
      });
  }, []);

  useMemo(() => {
    const filterbars = posts.filter((item) =>
      item.name.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase())
    );
    setSearchPosts(filterbars);
  }, [searchInput]);

  return (
    <Page style={{ backgroundColor: "#f1f1f1" }}>
      <SearchHeader setSearchInput={setSearchInput} />
      <div className="spacing-headerbar"></div>
      <Box>
        {searchposts.map((item, index) => {
          return <SearchItem key={index} post={item} />;
        })}
      </Box>
    </Page>
  );
}
export default Booking;
