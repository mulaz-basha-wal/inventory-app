import * as React from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";

const actions = [
  { icon: <AddShoppingCartRoundedIcon />, name: "Add Product" },
  { icon: <CategoryRoundedIcon />, name: "Add Category" },
];

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

export default function BasicSpeedDial(props) {
  const [popen, setPOpen] = React.useState(false);
  const [copen, setCOpen] = React.useState(false);
  const [category, setCategory] = React.useState("");
  const [file, setFile] = React.useState({ preview: "", data: "" });
  const profile = JSON.parse(localStorage.getItem("user"));
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
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

  const handleFileChange = (e) => {
    const fileData = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setFile(fileData);
  };

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  const handleOpen = (modal) => {
    if (modal === "Add Product") setPOpen(true);
    else setCOpen(true);
  };

  const handleClose = (modal) => {
    if (modal === "Add Product") setPOpen(false);
    else setCOpen(false);
  };

  const submitCategory = (e) => {
    e.preventDefault();
    axios
      .post(
        "/categories",
        {
          name: e.target.category_field.value,
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
          props.handleAlert({
            severity: "success",
            message: "Category added successfully",
          });
        }
      })
      .catch((error) => {
        props.handleAlert({
          severity: "error",
          message: "Category adding failed",
        });
      });
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("file", file.data);
    await axios
      .post("/upload", formData, {
        headers: {
          Authorization: profile.accessToken,
          "Content-Type": "application/x-www-form-urlencoded",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        axios
          .post(
            "/inventory",
            {
              name: e.target.product_name.value,
              description: e.target.description.value,
              quantity: e.target.product_count.value,
              category_id: category,
              user_id: profile.id,
              image: response.data.filename,
            },
            {
              headers: {
                Authorization: profile.accessToken,
              },
            }
          )
          .then((res) => {
            props.reloadItems();
            props.handleAlert({
              severity: "success",
              message: "Item added successfully",
            });
          })
          .catch((error) => {
            props.handleAlert({
              severity: "error",
              message: "Item adding failed",
            });
            axios.delete(`/upload/${response.data.filename}`, {
              headers: {
                Authorization: profile.accessToken,
                "Content-Type": "application/x-www-form-urlencoded",
                "Access-Control-Allow-Origin": "*",
              },
            });
          });
      })
      .catch((error) => {
        console.log(error);
        alert("Error occured");
      });
  };

  return (
    <React.Fragment>
      <Box>
        <SpeedDial
          ariaLabel='SpeedDial basic example'
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}>
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={(e) => {
                handleOpen(action.name);
              }}
            />
          ))}
        </SpeedDial>
      </Box>
      <Modal
        open={popen}
        onClose={(e) => {
          handleClose("Add Product");
        }}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'>
        <Box
          sx={style}
          component='form'
          enctype='multipart/form-data'
          onSubmit={submitProduct}>
          <Typography
            id='modal-modal-title'
            variant='h5'
            component='h2'
            sx={{ textAlign: "center", fontWeight: "bold" }}>
            Add Product
          </Typography>
          <TextField
            name='product_name'
            id='outlined-basic'
            label='Product Name'
            variant='outlined'
            size='small'
            sx={{ mx: "auto", my: 1, width: 1 }}
          />
          <TextField
            name='product_count'
            label='Product Count'
            type='number'
            size='small'
            sx={{ mx: "auto", my: 1, width: 1 }}
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
          <TextField
            sx={{ mx: "auto", my: 1, width: 1 }}
            id='standard-textarea'
            label='Description'
            placeholder='Enter product description in short'
            multiline
            name='description'
            maxRows={5}
          />
          <input
            accept='image/png,image/jpg,image/jpeg'
            className='form-control'
            type='file'
            id='formFile'
            onChange={handleFileChange}
          />
          <Box sx={{ display: "flex", justifyContent: "right" }}>
            <Button
              varient='contained'
              color='error'
              onClick={(e) => {
                handleClose("Add Product");
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
              Add Product
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={copen}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'>
        <Box sx={style} component='form' onSubmit={submitCategory}>
          <Typography
            id='modal-modal-title'
            variant='h5'
            component='h2'
            sx={{ textAlign: "center", fontWeight: "bold" }}>
            Add Category
          </Typography>
          <TextField
            required
            id='outlined-basic'
            label='Category Name'
            variant='outlined'
            name='category_field'
            size='small'
            sx={{ mx: "auto", my: 1, width: 1 }}
          />
          <Box sx={{ display: "flex", justifyContent: "right" }}>
            <Button
              varient='contained'
              color='error'
              onClick={(e) => {
                handleClose("Add Category");
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
              Add Category
            </Button>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
}
