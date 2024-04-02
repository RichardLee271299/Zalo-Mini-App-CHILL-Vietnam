import React from "react";
import { Header, Box, useNavigate, Input, Icon } from "zmp-ui";

const HeaderBar = ({ setSearchInput }) => {
  const navigate = useNavigate();
  return (
    <Header
      showBackIcon={false}
      className="header"
      title={
        <Box className="header-has-icon">
          <Icon
            className="header-icon"
            icon="zi-arrow-left"
            onClick={() =>
              navigate(-1, {
                replace: true,
                animate: true,
                direction: "backward",
              })
            }
          />
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="header-searchbar"
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </Box>
      }
    />
  );
};
export default HeaderBar;
