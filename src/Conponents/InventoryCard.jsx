import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ModeEditOutlineRoundedIcon from "@mui/icons-material/ModeEditOutlineRounded";

export default function MediaCard(props) {
  const baseUrl = "http://localhost:4000";
  return (
    <Card sx={{ width: 240, maxWidth: 250, margin: 2 }}>
      <CardMedia
        component='img'
        height='140'
        image={baseUrl + `/uploads/${props.data.image}`}
        alt='Laptop Apple'
      />
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {props.data.name}
        </Typography>
        <Typography
          variant='body2'
          color='text.secondary'
          overflow='hidden'
          whiteSpace='pre-line'
          textOverflow='ellipsis'
          height={40}>
          {props.data.description}
        </Typography>
        <div className='product-data-container'>
          <Typography variant='h6' color='text.secondary'>
            Quantity: {props.data.quantity}
          </Typography>
          <div className='edit-delete-container'>
            <button
              className='btn btn-danger p-0 m-1'
              onClick={() => {
                props.deleteItem(props.data.id);
              }}>
              <DeleteRoundedIcon />
            </button>
            <button
              className='btn btn-success p-0 m-1'
              onClick={() => {
                props.editItem(props.data);
              }}>
              <ModeEditOutlineRoundedIcon />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
