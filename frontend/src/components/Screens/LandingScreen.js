import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import { red } from "@mui/material/colors";
import FormControl from "@mui/material/FormControl";
import Icon from "@mui/material/Icon";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../util/axiosConfig.js";
import Alert from "@mui/material/Alert";
import * as types from "../../Redux/actionTypes.js";
import { useDispatch, useSelector } from "react-redux";

import {
  circleShape,
  rectangleShape,
  rhombusShape,
  EllipseShape,
} from "../Draw/Shapes.js";
import "./LandingScreen.css";


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const LandingScreen = () => {
  const dispatch = useDispatch();
  const Input = styled("input")({
    display: "none",
  });
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const style1 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 900,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    height: "auto",
    p: 4,
  };

  const navigate = useNavigate();
  const arr = [1, 2, 34, 5, 6, 7, 8, 7];
  const [expanded, setExpanded] = useState(false);
  const [paperBackground, setPaperBackground] = useState(
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJ2LTQiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzIGlkPSJ2LTMiPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuXzAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3QgaWQ9InYtNSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iI0FBQUFBQSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgaWQ9InYtNyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuXzApIi8+PC9zdmc+"
  );
  const [paperName, setPaperName] = useState("");
  const [level, setlevel] = React.useState("");
  const [selectedShape, setSelectedShape] = useState(null);
  const [name, setName] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [shapeFormError, setShapeFormError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [Filess, setFiless] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);
  const HandlerLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };
  useEffect(async () => {
    if (Filess) {
      const getBase64 = (file) => {
        return new Promise((resolve) => {
          let fileInfo;
          let baseURL = "";
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            baseURL = reader.result;
            resolve(baseURL);
          };
        });
      };
      const baseURLLL = await getBase64(Filess);
      console.log("???????", baseURLLL);
    }
  }, [Filess]);
  useEffect(() => {
    let user = localStorage.getItem("loggedIn");
    if (!user) {
      navigate("/login");
    }
  }, []);

  const papersAll = useSelector((state) => state.paper.papers);
  console.log("All papers", papersAll);
  useEffect(() => {
    dispatch({ type: types.FETCH_PAPER_START });
  }, [deleteStatus]);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const uploadBackground = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.set("name", paperName);
    formData.set("background", paperBackground);
    try {
      let { data } = await axios.post("/paper", formData);
      setOpen(false);
      papersAll.push(data);
      setLoading(false);
      setPaperBackground(data.image);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setlevel(event.target.value);
  };

  const handleShape = (shape) => {
    console.log("handle Shape");
    if (shape === "rectangle") {
      rectangleShape.level = level;
      setSelectedShape(rectangleShape);
    } else if (shape === "round") {
      setSelectedShape(circleShape);
    } else if (shape === "roumbous") {
      setSelectedShape(rhombusShape);
    } else if (shape === "eclips") {
      setSelectedShape(EllipseShape);
    }
  };

  const handleShapeForm = async (e) => {
    e.preventDefault();
    selectedShape.id = "123";
    selectedShape.fgfgfg = "12gfgfgfgf3";

    if (selectedShape && name && displayName && level) {
      selectedShape.attr({
        // selectors as defined in the JSON markup
        body: { refWidth: "100%", refHeight: "100%" },
        label: { text: name },
        text: { text: name },

        level: level,
        // using CSS selectors is significantly slower
        // rect: { fill: 'blue' },
        // text: { fill: 'white', fontSize: 15 },
        // '.myrect2': { fill: 'red' }
      });
      const body = {
        name: name,
        displayname: displayName,
        level,
        shapedata: JSON.stringify(selectedShape),
      };
      try {
        const { data } = await axios.post("/shapes", body);
        setOpen1(false);
      } catch (error) {}
    } else {
      setShapeFormError(true);
      setTimeout(() => {
        setShapeFormError(false);
      }, 3000);
    }
  };

  const deletePaperHandler = async (id) => {
    try {
      const { data } = await axios.delete(`/paper/${id}`);
      setDeleteStatus(!deleteStatus);
    } catch (error) {}
  };
  return (
    <div className="MainDiv">
      <div className="tools">
        <h1>NEO SILICA DRAW TOOL</h1>
        <Button
          style={{ height: "40px", marginTop: "10px" }}
          variant="contained"
          onClick={HandlerLogout}
        >
          Logout
        </Button>
      </div>
      <div className="Seconddiv">
        <div className="leftDiv">
          <div className="leftInner">
            <div className="paperhead1">
              Create Floor
              <Icon
                onClick={handleOpen}
                baseClassName="material-icons-two-tone"
              >
                add_circle
              </Icon>
            </div>
            {/* <input type={'file'}onChange={(e)=>{
              setFiless(e.target.files[0])
            }}></input> */}

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                {/* <div className="modalInner">
                  <h4>Choose Default</h4>
                  <input type={"radio"}></input>
                </div> */}
                <form onSubmit={uploadBackground}>
                  <div className="modalInner">
                    <h4 className="mt-3">Paper Name</h4>
                    <input
                      type={"text"}
                      onChange={(e) => {
                        setPaperName(e.target.value);
                      }}
                    ></input>
                  </div>
                  <div className="modalInner">
                    <h4 className="mt-3">Choose Bckground</h4>

                    <label className="mt-3" htmlFor="icon-button-file">
                      <Input
                        accept="image/*"
                        onChange={(e) => {
                          setPaperBackground(e.target.files[0]);
                        }}
                        id="icon-button-file"
                        type="file"
                      />

                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                      >
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  </div>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      style={{ marginLeft: "200px", marginTop: "10px" }}
                    >
                      Crete
                    </Button>
                  )}
                </form>
              </Box>
            </Modal>
            <Modal
              open={open1}
              onClose={handleClose1}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style1}>
                <form onSubmit={handleShapeForm}>
                  <div className="formInner">
                    <div className="form-seperate">
                      <div className="testF">
                        <div className="testname">
                          <h4>Name</h4>
                        </div>
                        <TextField
                          style={{ width: "50%" }}
                          id="outlined-basic"
                          label="name"
                          variant="outlined"
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                        />
                      </div>
                      <div className="testF">
                        <div className="testname">
                          <h4>Display Name</h4>
                        </div>
                        <TextField
                          style={{ width: "50%" }}
                          id="outlined-basic"
                          label="Display name"
                          variant="outlined"
                          onChange={(e) => {
                            setDisplayName(e.target.value);
                          }}
                        />
                      </div>
                      <div className="testF mt-3">
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Level
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={level}
                            label="Age"
                            onChange={handleChange}
                          >
                            <MenuItem value={1}>Level 1</MenuItem>
                            <MenuItem value={2}>Level 2</MenuItem>
                            <MenuItem value={3}>Level 3</MenuItem>
                          </Select>
                        </FormControl>
                        <div></div>
                      </div>
                    </div>
                    <div className="form-seperate">
                      <h4 className="headS">Choose shape</h4>
                      <div className="fs-1">
                        <img
                          className="shapeImage"
                          src="/images/round1.png"
                          onClick={() => {
                            handleShape("round");
                          }}
                        ></img>
                        <img
                          className="shapeImage"
                          src="/images/rectangle.png"
                          onClick={() => {
                            handleShape("rectangle");
                          }}
                        ></img>
                      </div>
                      <div className="fs-1">
                        <img
                          className="shapeImage"
                          src="/images/Roumbus.png"
                          onClick={() => {
                            handleShape("roumbous");
                          }}
                        ></img>
                        <img
                          className="shapeImage"
                          src="/images/eclips.png"
                          onClick={() => {
                            handleShape("eclips");
                          }}
                        ></img>
                      </div>
                    </div>
                    <div className="form-seperate3">
                      <Button type="submit" variant="contained" color="error">
                        create
                      </Button>
                    </div>
                  </div>
                </form>
                {shapeFormError && (
                  <Alert variant="outlined" severity="error">
                    Fill Form Currectly
                  </Alert>
                )}
              </Box>
            </Modal>
            <div className="paperhead1">
              Create Shapes
              <Icon
                onClick={handleOpen1}
                baseClassName="material-icons-two-tone"
              >
                add_circle
              </Icon>
            </div>
          </div>
        </div>
        <div className="rightDiv">
          <Row style={{ width: "90%" }}>
            {papersAll &&
              papersAll.map((item) => (
                <Col className="mt-3" sm={1} md={3} xl={2} key={item._id}>
                  <Card sx={{ maxWidth: 250 }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                          R
                        </Avatar>
                      }
                      action={
                        <IconButton aria-label="settings">
                          <MoreVertIcon />
                        </IconButton>
                      }
                      title={item.name}
                      subheader="September 14, 2016"
                    />
                    <CardMedia
                      component="img"
                      height="194"
                      image={item.image}
                      alt="Paella dish"
                    />
                    <CardContent></CardContent>
                    <CardActions disableSpacing>
                      <IconButton aria-label="add to favorites" onClick={() => {
                            deletePaperHandler(item._id);
                          }}>
                        <DeleteIcon/>
                      </IconButton>
                      <IconButton aria-label="share">
                        <Link to={`/paper/${item._id}`}>
                          {" "}
                          <OpenInNewIcon />
                        </Link>
                      </IconButton>
                      <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                      ></ExpandMore>
                    </CardActions>
                    <Collapse
                      in={expanded}
                      timeout="auto"
                      unmountOnExit
                    ></Collapse>
                  </Card>
                </Col>
              ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
