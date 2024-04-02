import { Box, Text, useNavigate } from "zmp-ui";
import { useRecoilState } from "recoil";
import { BarDetailData } from "../../state";
function SearchItem({ index, post }) {
  const [barDetail, setBarDetail] = useRecoilState(BarDetailData);
  const navigate = useNavigate();

  return (
    <Box
      className="flex search-item-block"
      onClick={() => {
        setBarDetail(post);
        navigate("/postdetail");
      }}
    >
      <img className="search-item__logo" src={post.thumb} />
      <div className="flex-c search-item__description">
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{post.name}</Text>
        <Text style={{ fontSize: 14, color: "#666" }}>{post.address}</Text>
      </div>
    </Box>
  );
}
export default SearchItem;
