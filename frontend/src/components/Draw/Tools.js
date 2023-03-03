import React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./Tools.css";
const Tools = ({
  downloadImage,
  handleAddLine,
  handleUndo,
  handleRedo,
  zoomOut,
  zoomIn,
  id,
  graph
}) => {
  return (
    <div className="tools">
      <button onClick={downloadImage}>
        <img width={"100%"} height={"100%"} src="/images/download2.png"></img>
      </button>
      <Button onClick={handleAddLine} variant="outline-info">
        INSERT LINE
      </Button>
      <Button onClick={handleUndo} variant="outline-info">
        <img width={"30px"} height={"30px"} src="/images/undo.png"></img>
      </Button>
      <Button onClick={handleRedo} variant="outline-info">
        <img width={"30px"} height={"30px"} src="/images/redo.png"></img>
      </Button>
      <Button onClick={() => graph.clear()} variant="outline-error">
        <ClearIcon />
      </Button>
      <Button
        style={{ marginLeft: "20px" }}
        onClick={zoomOut}
        variant="outline-warning"
      >
        <img width={"30px"} height={"30px"} src="/images/out.png"></img>
      </Button>

      <Button onClick={zoomIn} variant="outline-warning">
        <img width={"30px"} height={"30px"} src="/images/in.png"></img>
      </Button>
      <div>
        <Link to={`/diagram/${id}`}>
          {" "}
          <Button onClick={zoomIn} variant="outline-warning">
            Create Diagram
          </Button>{" "}
        </Link>
      </div>
    </div>
  );
};

export default Tools;
