import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material" 
import React, { useEffect } from "react" 
import { useLocation, useNavigate } from "react-router" 
import { SideBarProps } from "./SiderBarProps" 
import { getParentPath } from "@/shared/utils/getParentPath"

function SideBar({ items }: { items: SideBarProps[] }) {

  const navigate = useNavigate() 
  const location = useLocation()

  const [selectedIndex, setSelectedIndex] = React.useState<number | undefined>(1) 

  // Track route change
  useEffect(() => {
    
    const currentPath = getParentPath(location.pathname)
    const currentItem = items.find((item) => currentPath === (item.path))

    if(currentItem){
      setSelectedIndex(currentItem.id)
      localStorage.setItem(atob("selectedSidebar"), currentItem.id.toString())
    }
  }, [location.pathname, items])

  const handleNavigation = (item: SideBarProps) => {
    navigate(item.path) 
  } 

  return (
    <Box>
      <List>
        {items.map((item: SideBarProps) => (
          <ListItemButton
            key={item.id}
            sx={{
              borderRadius: 2,
              "&:hover": { backgroundColor: "lightgrey", overflow: 'hidden' },
            }}
            onClick={() => handleNavigation(item)}
            selected={selectedIndex == item.id}
          >
            <ListItemIcon sx={{ minWidth: "30px" }}>
              <item.icon />
            </ListItemIcon>
            <ListItemText sx={{ overflow: 'hidden' }} primary={item.name} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  ) 
}

export default SideBar 
