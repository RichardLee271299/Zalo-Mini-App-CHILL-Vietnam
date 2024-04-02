import React from "react";
import { Header, Box, useNavigate, Text, Icon } from "zmp-ui";

const HeaderBar = ({ title }) => {
  const navigate = useNavigate();
  return (
    <Header
      showBackIcon={false}
      className="header"
      title={
        <Box
          className="flex"
          onClick={() =>
            navigate(-1, {
              replace: true,
              animate: true,
              direction: "backward",
            })
          }
        >
          <Icon icon="zi-arrow-left" style={{ marginRight: 8 }} />
          <Text.Title size="xsmall">{title}</Text.Title>
        </Box>
      }
    />
  );
};
export default HeaderBar;
