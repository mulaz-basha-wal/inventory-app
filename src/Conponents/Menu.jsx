import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import { Button, Typography } from "@mui/material";
import { useLocation, Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

export default function IMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const profile = JSON.parse(localStorage.getItem("user"));
  const open = Boolean(anchorEl);
  let navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios
      .get("/managers/checkToken", {
        headers: {
          Authorization: profile.accessToken,
          "Content-Type": "application/x-www-form-urlencoded",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .catch((error) => {
        alert("Session expired. please log in again");
        localStorage.removeItem("user");
        localStorage.setItem("isLoggedIn", "0");
        navigate("/");
      });
  }, [location]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.setItem("isLoggedIn", "0");
    navigate("/");
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "space-between",
          px: 2,
        }}>
        <Typography
          variant='h5'
          component='h3'
          sx={{
            mx: 0,
            fontWeight: "bold",
            color: "white",
            fontFamily: "Source Sans Pro",
          }}>
          <i> E-Inventory</i>
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            justifyContent: "right",
            px: 2,
            my: 1,
          }}>
          <Button
            varient='contained'
            sx={{
              mx: 1,
              fontWeight: "bold",
              color: "white",
              display: { xs: "none", sm: "block", md: "block", lg: "block" },
            }}>
            <Link className='text-decoration-none' to='/inventory/dashboard'>
              Dashboard
            </Link>
          </Button>
          {/* <Button
            varient='contained'
            sx={{
              mx: 0,
              fontWeight: "bold",
              color: "white",
              display: { xs: "none", sm: "block", md: "block", lg: "block" },
            }}>
            <Link className='text-decoration-none' to='/inventory/categories'>
              Categories
            </Link>
          </Button> */}
          <Button
            varient='contained'
            sx={{
              mx: 1,
              fontWeight: "bold",
              color: "white",
              display: { xs: "none", sm: "none", md: "block", lg: "block" },
            }}>
            Contact
          </Button>
          <Button
            varient='contained'
            sx={{
              mx: 1,
              fontWeight: "bold",
              color: "white",
              display: { xs: "none", sm: "block", md: "block", lg: "block" },
            }}>
            About
          </Button>
          <Tooltip title={`${profile.firstName + " " + profile.lastName}`}>
            <IconButton
              onClick={handleClick}
              size='small'
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup='true'
              aria-expanded={open ? "true" : undefined}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "white",
                  color: "black",
                }}>
                {JSON.parse(localStorage.getItem("user")).firstName[0]}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
        <MenuItem
          onClick={() => {
            navigate("/inventory/profile");
          }}>
          <Avatar /> Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <Outlet />
    </React.Fragment>
  );
}
