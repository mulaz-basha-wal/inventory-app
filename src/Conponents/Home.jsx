import axios from "axios";
import MediaCard from "./InventoryCard";
import BasicSpeedDial from "./SpeedDial";
import NoProducts from "./NoProducts";
import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button, Divider, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  maxWidth: "85vw",
  maxHeight: "85vw",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
  overflowY: "auto",
};

export default function Home() {
  const [popen, setPOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [inventoryItems, setInventoryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const profile = JSON.parse(localStorage.getItem("user"));
  const [name, setName] = useState("");
  const [count, setCount] = useState(0);
  const [desc, setDesc] = useState("");
  const [id, setID] = useState(null);

  const [infoMessage, setInfoMessage] = useState({
    severity: "error",
    message: "",
  });

  useEffect(() => {
    requestDB();
    axios
      .get("/categories", {
        headers: {
          Authorization: profile.accessToken,
          "Content-Type": "application/x-www-form-urlencoded",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        setCategories(res.data.categories);
      });
  }, []);

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const requestDB = async () => {
    await axios
      .get(`/inventory/${profile.id}`, {
        headers: {
          Authorization: profile.accessToken,
          "Content-Type": "application/x-www-form-urlencoded",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        setInventoryItems(res.data.inventory_items);
      });
  };

  const handleAlert = (data) => {
    setInfoMessage(data);
    setOpen(true);
  };

  const deleteItem = (id) => {
    axios
      .delete(`/inventory/${id}`, {
        headers: {
          Authorization: profile.accessToken,
          "Content-Type": "application/x-www-form-urlencoded",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        if (res.data.status === true) {
          setInfoMessage({
            severity: "success",
            message: res.data.message || "Deleted Successfully",
          });
          setOpen(true);
          requestDB();
        } else {
          setInfoMessage({
            severity: "error",
            message: res.data.message || "Unknown Error occured",
          });
          setOpen(true);
        }
      })
      .catch((error) => {
        setInfoMessage({
          severity: "error",
          message: error.message || "Unknown Error occured",
        });
        setOpen(true);
      });
  };

  const editItem = (data) => {
    setPOpen(true);
    setName(data.name);
    setCount(data.quantity);
    setDesc(data.description);
    setID(data.id);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(
        `/inventory/${id}`,
        {
          name: e.target.product_name.value,
          description: e.target.description.value,
          quantity: e.target.product_count.value,
          category_id: category,
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
        if (res.data.status === true) {
          setInfoMessage({
            severity: "success",
            message: res.data.message || "Updated Successfully",
          });
          setOpen(true);
          requestDB();
        } else {
          setInfoMessage({
            severity: "error",
            message: res.data.message || "Unknown Error occured",
          });
          setOpen(true);
        }
      })
      .catch((error) => {
        setInfoMessage({
          severity: "error",
          message: error.message || "Unknown Error occured",
        });
      });
  };

  return (
    <div>
      {inventoryItems.length <= 0 ? (
        <NoProducts />
      ) : (
        <div>
          <Divider light />
          <h5 className='text-light text-center mt-3'>
            Available Inventory Items
          </h5>
          <Divider />
          <div className='mediacards'>
            {inventoryItems.map((item) => {
              return (
                <MediaCard
                  key={item.id}
                  data={item}
                  deleteItem={deleteItem}
                  editItem={editItem}
                />
              );
            })}
          </div>
        </div>
      )}
      <BasicSpeedDial handleAlert={handleAlert} reloadItems={requestDB} />
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

      <Modal
        open={popen}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'>
        <Box
          sx={style}
          component='form'
          enctype='multipart/form-data'
          onSubmit={handleUpdate}>
          <Typography
            id='modal-modal-title'
            variant='h5'
            component='h2'
            sx={{ textAlign: "center", fontWeight: "bold" }}>
            Update Product
          </Typography>
          <TextField
            name='product_name'
            id='outlined-basic'
            label='Product Name'
            variant='outlined'
            size='small'
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            sx={{ mx: "auto", my: 1, width: 1 }}
          />
          <TextField
            name='product_count'
            id='outlined-number'
            label='Product Count'
            type='number'
            size='small'
            value={count}
            onChange={(e) => {
              setCount(e.target.value);
            }}
            sx={{ mx: "auto", my: 1, width: 1 }}
          />
          <TextField
            sx={{ mx: "auto", my: 1, width: 1 }}
            id='standard-textarea'
            label='Description'
            placeholder='Enter product description in short'
            multiline
            name='description'
            maxRows={5}
            value={desc}
            onChange={(e) => {
              setDesc(e.target.value);
            }}
          />
          <FormControl sx={{ mx: "auto", my: 1, width: 1 }} size='small'>
            <InputLabel id='demo-select-small'>Category</InputLabel>
            <Select
              labelId='demo-select-small'
              id='demo-select-small'
              value={category}
              label='Category'
              onChange={handleChange}>
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              {categories.map((cat) => {
                return (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", justifyContent: "right" }}>
            <Button
              varient='contained'
              color='error'
              onClick={(e) => {
                setPOpen(false);
              }}
              sx={{
                my: 2,
                fontWeight: "bold",
              }}>
              Cancel
            </Button>
            <Button
              varient='contained'
              color='success'
              type='submit'
              sx={{
                my: 2,
                fontWeight: "bold",
              }}>
              Update Product
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
