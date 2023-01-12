import React, { useState } from "react";
import "./styles.css";
import { FiEdit } from "react-icons/fi";
import axios from "axios";

import Typography from "@mui/material/Typography";

import Modal from "@mui/material/Modal";
import {
  styled,
  Box,
  TextareaAutosize,
  Button,
  InputBase,
  FormControl,
  TextField,
} from "@mui/material";
import { useEffect } from "react";

const Container = styled(Box)(({ theme }) => ({
  padding: "10px",
  [theme.breakpoints.down("md")]: {
    margin: 0,
  },
}));

const initialPost = {
  header: "",
  image: "",
};

const AdminPanel = () => {
  const [post, setPost] = useState(initialPost);
  const [file, setFile] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const[showImage, setShowImage] = useState('');
  const [header, setHeader] = useState("");
  const [count, setCount] = useState('');

  useEffect(() => {
    const unsubscribe = async () => {
      const result = await axios({
        method: "get",
        url: "https://pepper-api/admin/details.onrender.com",
        headers: {
          Accept: "application/json, form-data",
        },
      });
      // console.log(result.data);
      setHeader(result.data.details.header);
      setShowImage(result.data.details.image);
      setPost(result.data.details);
      setCount(result.data.details.count);
    };
    unsubscribe();
  }, []);

  useEffect(() => {
    const getImage = async () => {
      if (file) {
        const data = new FormData();
        data.append("name", file.name);
        data.append("file", file);
        // console.log(data.get('file'))

        const response = await axios({
          method: "put",
          url: "https://pepper-api/admin/file/upload.onrender.com",
          headers: { "Content-Type": "multipart/form-data" },
          data: data
        });
        if (response.data.isTrue) {
          post.image = response.data.imageUrl;
          setImageURL(response.data.imageUrl);
        }
      }
    };
    getImage();
  }, [file]);

  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 600,
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: 5
  };

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const UpdateData = async () => {
    try {
      const data = new FormData();
      data.append("header", post.header);
      data.append("image", post.image);
      const result = await axios({
        method: "put",
        url: "https://pepper-api/admin/update.onrender.com",
        headers: {
        Accept: "application/json, form-data"
      },
        data: post,
      });
      alert("Updated Successfully");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className="container">
        <div className="card">
          <div className="adminContainer">
            <h1 className="boldText">Admin Panel</h1>
          </div>
          <hr />

          <div className="btnCountContainer">
            <p className="Text">
              Request a demo Button is Pressed <span>{count}</span> times
            </p>
          </div>
          <hr />

          <div className="content">
            <p>Current Header Text:</p>
            <p className="header">{header}</p>
            
            <div className="flex">
              <p>Current Header Logo: </p>
              <img className="logo" src={showImage} alt="header logo"></img>
            </div>
          </div>

          <hr />

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button onClick={() => handleOpen()} className="btn">
              <FiEdit className="edit-icon" />
              Edit
            </button>
          </div>
          <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Container>
                <FormControl>
                  <label htmlFor="header">Header</label>
                  <TextField
                    sx={{ marginBottom: 3 }}
                    id="outlined-basic"
                    variant="outlined"
                    onChange={(e) =>
                      setPost({
                        ...post,
                        [e.target.name]: e.target.value,
                      })
                    }

                    value={post.header}
                    name="header"
                  />

                  <label style={{ marginBottom: 10 }} htmlFor="image">
                    Update Navbar
                  </label>
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    name="image"
                    onChange={(e) => {
                      setPost({ ...post, image: e.target.files[0] });
                      setFile(e.target.files[0]);
                    }}
                  />
                  <Button
                    onClick={() => UpdateData()}
                    variant="contained"
                    sx={{ marginTop: 3, width: 120 }}
                  >
                    Submit
                  </Button>
                </FormControl>
              </Container>
              <Button onClick={(e) => setIsOpen(false)}>Cancel</Button>
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
