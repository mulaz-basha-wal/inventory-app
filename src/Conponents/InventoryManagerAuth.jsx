import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Fingerprint from "@mui/icons-material/Fingerprint";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";

export default function InventoryManagerAuth() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState({
    severity: "error",
    message: "",
  });
  let navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/managers/auth", {
        username: e.target.username.value,
        password: e.target.password.value,
      })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("isLoggedIn", "1");
        setInfoMessage({ severity: "success", message: res.data.message });
        setOpen(true);
        setLoading(false);
        navigate("/inventory/dashboard");
      })
      .catch((err) => {
        console.log(err);
        setInfoMessage({
          severity: "error",
          message: err.response.data.message || "Server Error",
        });
        setOpen(true);
        setLoading(false);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          borderRadius: "10px",
          margin: "25% auto",
          padding: "10px 20px",
          backgroundColor: "white",
        }}>
        <Avatar
          sx={{
            margin: "10px auto",
            backgroundColor: "green",
          }}>
          <LockOpenIcon />
        </Avatar>
        <Typography
          component='h1'
          variant='h5'
          sx={{
            textAlign: "center",
            // marginBottom: "30px",
            fontWeight: "bold",
          }}>
          Inventory Manager Auth
        </Typography>
        <p className='company-name'>
          <i> by E-Inventory</i>
        </p>
        <Box
          component='form'
          onSubmit={handleClick}
          sx={{
            textAlign: "center",
          }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='username'
            label='Username'
            name='username'
            autoFocus
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
          />
          <LoadingButton
            type='submit'
            loading={loading}
            loadingPosition='end'
            endIcon={<Fingerprint color='dark' />}
            variant='contained'
            sx={{
              margin: "15px",
              color: "black",
            }}>
            Log in
          </LoadingButton>

          {/* Alert Bar */}
          <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}>
            <Alert
              onClose={handleClose}
              severity={infoMessage.severity}
              variant='filled'>
              {infoMessage.message}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Container>
  );
}
