import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Container from "@mui/material/Container";
import axios from "axios";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export default function Profile() {
  const profile = JSON.parse(localStorage.getItem("user"));
  const [open, setOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState({
    severity: "error",
    message: "",
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleChange = (e) => {
    e.preventDefault();
    axios
      .post(
        `/managers/changepassword/${profile.id}`,
        {
          username: profile.username,
          oldpassword: e.target.oldpassword.value,
          newpassword: e.target.newpassword.value,
        },
        {
          headers: {
            Authorization: profile.accessToken,
            "Content-Type": "application/x-www-form-urlencoded",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        console.log(res);
        setInfoMessage({ severity: "success", message: res.data.message });
        setOpen(true);
      })
      .catch((err) => {
        console.log(err);
        setInfoMessage({
          severity: "error",
          message: err.response.data.message || "Server Error",
        });
        setOpen(true);
      });
  };

  return (
    <div>
      <div className='tables-wrapper m-5'>
        <table className='table profile-table bg-light text-dark'>
          <thead>
            <tr>
              <th scope='col'>Key</th>
              <th scope='col'>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>ID</th>
              <td>{profile.id}</td>
            </tr>
            <tr>
              <th>First Name</th>
              <td>{profile.firstName}</td>
            </tr>
            <tr>
              <th>Last Name</th>
              <td>{profile.lastName}</td>
            </tr>
            <tr>
              <th>Username</th>
              <td>{profile.username}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{profile.email}</td>
            </tr>
          </tbody>
        </table>
        <Container component='main' maxWidth='xs'>
          <Box
            component='form'
            onSubmit={handleChange}
            sx={{
              bgcolor: "white",
              p: 2,
              borderRadius: 2,
              m: 0,
            }}>
            <h3>Change password</h3>
            <TextField
              margin='normal'
              required
              fullWidth
              label='Old Password'
              name='oldpassword'
              autoFocus
              type='password'
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='newpassword'
              label='New Password'
              type='password'
            />
            <LoadingButton
              type='submit'
              variant='contained'
              sx={{
                margin: "15px",
                color: "black",
              }}>
              Change Password
            </LoadingButton>
          </Box>
        </Container>
      </div>
      {/* Alert Bar */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
        <Alert
          onClose={handleClose}
          severity={infoMessage.severity}
          variant='filled'>
          {infoMessage.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
