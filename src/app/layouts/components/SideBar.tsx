import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { SideBarProps } from "./SiderBarProps";
import React from "react";
import { useNavigate } from "react-router";

function SideBar({ items }: { items: SideBarProps[] }) {
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const navigate = useNavigate();

  const handleNavigation = (item: SideBarProps) => {
    navigate(item.path);
    setSelectedIndex(item.id);
  };

  return (
    <Box>
      <List>
        {items.map((item: SideBarProps) => (
          <ListItemButton
            key={item.id}
            sx={{
              borderRadius: 2,
              "&:hover": { backgroundColor: "lightgrey" },
            }}
            onClick={() => handleNavigation(item)}
            selected={selectedIndex == item.id}
          >
            <ListItemIcon sx={{ minWidth: "30px" }}>
              <item.icon />
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

export default SideBar;
