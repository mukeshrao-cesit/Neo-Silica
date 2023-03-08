import React, { useEffect, useState } from "react";
import "./PaperScreen.css";
import { dia, elementTools, format, shapes, ui, util } from "@clientio/rappid";
import axios from "../../../util/axiosConfig";
import { useParams } from "react-router-dom";
import { q1Shape, verticalLine1 } from "./1.Shape.js";
import { totalBox } from "./TotalBox";
import { q2Shape, verticalLine2 } from "./2.Shape";
import { q3Shape, verticalLine3 } from "./3.shape";
import { Button } from "react-bootstrap";
import Modal from "react-modal";
import html2canvas from "html2canvas";

const PaperScreen = () => {
  //STATES FOR PAPER
  const [paper, setPaper] = useState();
  const [graph, setGraph] = useState(
    new dia.Graph({}, { cellNamespace: shapes })
  );
  const [paperScreenWidth, setPaperScreenWidth] = useState(1680);
  const params = useParams();
  const [jsonData, setJsonData] = useState();
  const [savedpaper, setSavedPaper] = useState({});
  const [modalIsOpen, setIsOpen] = useState(false);

  // CUSTOM STYLE FOR MODAL
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      border: "none",
    },
  };

  let subtitle;

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  //TO CONVERT DIV ELEMENT TO CANVAS
  const downloadImage = () => {
    setIsOpen(true);
    html2canvas(document.querySelector("#paper")).then((canvas) => {
      canvas.id = "newcanvas";
      canvas.style.width = "500px";
      canvas.style.height = "70%";
      // canvas.style.display = "none";
      const element = document.getElementById("newcanvas");
      if (element) {
        element.remove();
      }
      const menu = document.querySelector("#menu");
      menu.appendChild(canvas);
    });
  };

  //TO DOWNLOAD GRAPH INTO IMAGE FORMAT
  const downloadimage2 = async (type) => {
    var canvas = document.getElementById("newcanvas");
    var imgData = canvas.toDataURL("image/jpeg", 1.0);
    if (type === "jpeg") {
      canvas.style.backgroundColor = "#FFFFFF";
      // var image = canvas.toDataURL("image/png", 1.0);
      var link = document.createElement("a");
      link.download = "my-image.jpeg";
      link.href = imgData;
      link.click();
    } else if (type === "png") {
      canvas.style.backgroundColor = "#FFFFFF";
      var link = document.createElement("a");
      link.download = "my-image.png";
      link.href = imgData;
      link.click();
    } else if (type === "pdf") {
      var pdf = new jsPDF();

      pdf.addImage(imgData, "JPEG", 0, 0);
      pdf.save("download.pdf");
    } else if (type === "svg") {
      var svgDoc = paper.svg;
      var serializer = new XMLSerializer();
      var source = serializer.serializeToString(svgDoc);

      //add name spaces.
      if (
        !source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)
      ) {
        source = source.replace(
          /^<svg/,
          '<svg xmlns="http://www.w3.org/2000/svg"'
        );
      }
      if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(
          /^<svg/,
          '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
        );
      }
      //add xml declaration
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

      //convert svg source to URI data scheme.
      var url =
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

      //set url value to a element's href attribute.
      var link = document.createElement("a");
      link.download = "my-image.svg";

      link.href = url;
      link.click();
    }
  };

  async function fetchData() {
    const { data } = await axios.get(`/paper/${params.id}`);
    if (data.jsondata) {
      setSavedPaper(data);
      setJsonData(JSON.parse(data.jsondata));
    }
  }
  function handleWidth(level) {
    let spaceLevel = (level.length + 3) * 10;
    let width = level.length * 130;
    if (paperScreenWidth < width + spaceLevel) {
      setPaperScreenWidth(width + spaceLevel + 20);
      paper.setDimensions(width + spaceLevel + 20, 1000);
      return width + spaceLevel + 10;
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    setPaper(
      new dia.Paper({
        el: $("#paper"),
        width: 1690,
        height: "100%",
        model: graph,
        cellViewNamespace: shapes,
        background: {
          color: "white",
          // image: savedpaper.image,
          position: { x: 0, y: 0 },
          size: { width: "100%" },
        },
        defaultLink: () =>
          new dia.Link({
            attrs: { ".marker-target": { d: "M 10 0 L 0 5 L 10 10 z" } },
          }),
      })
    );
  }, [savedpaper]);

  useEffect(() => {
    // const ac = new AbortController();

    if (paper && jsonData) {
      console.log("data from database", jsonData);
      let result = [];
      let TotalShapes = jsonData.cells.filter((item) => {
        if (item.type !== "link" && item.type !== "standard.Link") {
          return item;
        }
      });
      let horizontalLine;
      let horizondalStarts = 0;
      //TotalShapes is the data without links
      let level1 = [];
      let level2 = [];
      let level3 = [];
      //here we are initilizing three array, and map the totalshapes
      // and check the level and push the shapes to currosponding levels
      TotalShapes.map((item) => {
        if (item.level === 1) {
          level1.push(item);
        } else if (item.level === 2) {
          level2.push(item);
        } else if (item.level === 3) {
          level3.push(item);
        }
      });
      let papersWidth = 1685;
      let shapeWidth = 130;

      let spaceLevel1_1 = paper.$el.width() - shapeWidth * level1.length;
      spaceLevel1_1 = Math.round(spaceLevel1_1 / (level1.length + 1));
      // level2
      let spaceLevel2_2 = paper.$el.width() - shapeWidth * level2.length;
      spaceLevel2_2 = Math.round(spaceLevel2_2 / (level2.length + 1));
      // level3
      let spaceLevel3_3 = paper.$el.width() - shapeWidth * level3.length;
      spaceLevel3_3 = Math.round(spaceLevel3_3 / (level3.length + 1));

      if (spaceLevel1_1 < 10) {
        papersWidth = handleWidth(level1);
      } else if (spaceLevel2_2 < 10) {
        papersWidth = handleWidth(level2);
      } else if (spaceLevel3_3 < 10) {
        papersWidth = handleWidth(level3);
      }
      //---------------------------------------  LEVEL 1 ---------------------------------------->>
      //shapeWidth: here we are calculating level one shape width
      const resultQ1 = q1Shape(
        shapes,
        papersWidth,
        shapeWidth,
        level1,
        graph,
        result
      );
      horizontalLine = resultQ1.horizondalLink;
      graph.addCell(result);
      let drawData = graph.toJSON();
      verticalLine1(
        horizondalStarts,
        horizontalLine,
        dia,
        graph,
        resultQ1.connectPoint
      );
      let totalBox1;
      let totalBox2;

      result = [];

      ////---------------------------------------LEVEL 1  closed ----------------------------------------
      ////---------------------------------------LEVEL 2  start ----------------------------------------
      const resultQ2 = q2Shape(
        shapes,
        papersWidth,
        shapeWidth,
        level2,
        result,
        graph
      );
      let horizontalLine1 = resultQ2.horizondalLink1;
      let horizontalLine2 = resultQ2.horizondalLink2;
      horizondalStarts = 0;
      graph.addCell(result);
      verticalLine2(
        horizondalStarts,
        horizontalLine1,
        horizontalLine2,
        dia,
        graph,
        resultQ2.connectPoint
      );
      drawData = graph.toJSON();
      let cells = drawData.cells;
      let totalBox3;
      let totalBox4;
      if (level2.length > 0) {
        totalBox1 = totalBox(
          shapes,
          resultQ1.space,
          shapeWidth,
          resultQ1.underlineLength,
          170,
          resultQ1.totalTR
        );
        totalBox2 = totalBox(
          shapes,
          resultQ1.space,
          shapeWidth,
          resultQ1.underlineLength,
          220,
          resultQ2.totalTR
        );
        graph.addCell([totalBox1, totalBox2]);
        var link = new dia.Link();
        link.source(totalBox1);
        link.target(totalBox2);

        var linkJoin = new dia.Link();
        linkJoin.source(horizontalLine);
        linkJoin.target(totalBox1);
        link.addTo(graph);
        linkJoin.addTo(graph);
      }

      ////---------------------------------------LEVEL 2  closed ----------------------------------------

      ////---------------------------------------LEVEL 3 Started   ----------------------------------------
      // Math.round(paperWidth / level3.length) - 10 * level3.length;
      const resultQ3 = q3Shape(
        shapes,
        papersWidth,
        shapeWidth,
        level3,
        result,
        graph
      );
      if (level3.length > 0) {
        totalBox3 = totalBox(
          shapes,
          resultQ2.space,
          shapeWidth,
          resultQ2.underlineLength,
          440,
          resultQ2.totalTR
        );
        totalBox4 = totalBox(
          shapes,
          resultQ2.space,
          shapeWidth,
          resultQ2.underlineLength,
          500,
          resultQ3.totalTR
        );

        graph.addCell([totalBox3, totalBox4]);
        var link = new dia.Link();
        link.source(totalBox3);
        link.target(totalBox4);

        var linkJoin1 = new dia.Link();
        linkJoin1.source(totalBox2);
        linkJoin1.target(horizontalLine1);

        var linkJoin2 = new dia.Link();
        linkJoin2.source(totalBox3);
        linkJoin2.target(horizontalLine2);

        link.addTo(graph);
        linkJoin1.addTo(graph);
        linkJoin2.addTo(graph);
      }
      graph.addCell(result);
      drawData = graph.toJSON();
      horizondalStarts = 0;
      cells = drawData.cells;
      verticalLine3(
        horizondalStarts,
        resultQ3.horizondalLink1,
        resultQ3.horizondalLink2,
        dia,
        graph,
        resultQ3.connectPoint
      );

      var link = new dia.Link();
      link.source(totalBox4);
      link.target(resultQ3.horizondalLink1);
      link.addTo(graph);

      //------------------------------------------------------------------------------------------------------
    }
    // return () => ac.abort();
  }, [paper, jsonData]);

  useEffect(() => {
    if (paper) {
      paper.on("change:position", async function (cell) {});
      paper.on("cell:pointerup", async function (cell) {
        let jsonObject = graph.toJSON();
      });
    }
  }, [paper]);
  return (
    <div className="papermainDiv" style={{ width: paperScreenWidth + "px" }}>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div>
          <div style={{ border: "1px solid black" }} id="menu"></div>
          <div className="btndown">
            <Button
              className="btn-danger d-btn mt-5"
              onClick={() => {
                downloadimage2("jpeg");
              }}
            >
              JPEG
            </Button>
            <Button
              className="btn-danger d-btn mt-5"
              onClick={() => {
                downloadimage2("png");
              }}
            >
              PNG
            </Button>
            <Button
              className="btn-danger d-btn mt-5"
              onClick={() => {
                downloadimage2("svg");
              }}
            >
              SVG
            </Button>
            <Button
              className="btn-danger d-btn mt-5"
              onClick={() => {
                downloadimage2("pdf");
              }}
            >
              PDF
            </Button>
            <Button
              className="btn-danger d-btn mt-5"
              onClick={() => {
                downloadimage2("autocad");
              }}
            >
              AUTOCAD
            </Button>
          </div>
        </div>
      </Modal>
      <button className="download" onClick={downloadImage}>
        <img width='30px' height='30px' src="/images/download2.png"></img>
      </button>
      <div id="paper"></div>
    </div>
  );
};

export default PaperScreen;
