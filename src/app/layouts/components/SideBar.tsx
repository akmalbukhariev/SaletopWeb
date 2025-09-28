import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material" 
import React from "react" 
import { useNavigate } from "react-router" 
import { SideBarProps } from "./SiderBarProps" 

function SideBar({ items }: { items: SideBarProps[] }) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | undefined>(
    localStorage.getItem(atob("selectedSidebar"))
      ? Number(localStorage.getItem(atob("selectedSidebar")))
      : 1
  ) 

  const navigate = useNavigate() 

  const handleNavigation = (item: SideBarProps) => {
    navigate(item.path) 
    setSelectedIndex(item.id) 
    localStorage.setItem(atob("selectedSidebar"), item.id.toString()) 
  } 

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
  ) 
}

export default SideBar 
