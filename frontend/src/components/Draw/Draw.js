import { dia, elementTools, shapes, util } from "@clientio/rappid";

import html2canvas from "html2canvas";
import $ from "jquery";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Modal from "react-modal";
import { Link, useParams } from "react-router-dom";
import axios from "../../util/axiosConfig";
import "./Draw.css";
import {
  fadeAutoPort1,
  fadeAutoPort2,
  faderPort1,
  faderPort2,
} from "../Ports.js";
import { FadeAux, Fader, sales } from "./Shapes.js";
import Tools from "./Tools.js";

function App() {
  var c = 0;
  const params = useParams();
  // STATES FOR RESIZING ELEMENT
  const [sizeChange, setSizeChange] = useState(false);
  const [element, setElement] = useState(null);
  const [selectWidth, SetSelectWidth] = useState(null);
  const [selectHeight, SetSelectHeight] = useState(null);

  //STATES FOR COLOR CHANGE THE LINK
  const [showColorsOption, setShowColorsoption] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [selectLink, setSelectLink] = useState(null);

  //STATES FOR PAPER
  const [paper, setPaper] = useState();
  const [graph, setGraph] = useState(
    new dia.Graph({}, { cellNamespace: shapes })
  );

  const [photo, selectPhoto] = useState(null);

  //STATES FOR OPEN AND CLOSE MODAL
  const [modalIsOpen, setIsOpen] = useState(false);

  //STATES FOR CHANGIN LINE LABEL
  const [textValue, setTextValue] = useState("");

  //STATE FOR ZOOM
  const [zoomCount, setZoomCount] = useState(0);

  const [savedpaper, setSavedPaper] = useState({});

  //-------------------------<MODAL>---------------------------->>

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
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  //-------------------------</MODAL>---------------------------->>

  //TO HANDLE ELEMENT RESIZING
  const handleElementSize = () => {
    if (!selectWidth) {
      SetSelectWidth(element.model.prop("size/width"));
    }
    if (!selectHeight) {
      SetSelectHeight(element.model.prop("size/height"));
    }
    element.model.resize(selectWidth, selectHeight);
    SetSelectWidth(null);
    SetSelectHeight(null);
  };
  //------------------------------------------------------------->>

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`/paper/${params.id}`);
      if (data.jsondata) {
        graph.fromJSON(JSON.parse(data.jsondata));
      }

      setSavedPaper(data);
    };
    fetchData();
    return () => {
      let jsonObject = graph.toJSON();
      console.log(">>>>", jsonObject);
      let jsonString = JSON.stringify(jsonObject);

      if (navigator.onLine) {
        const { data } = axios.post(`/paper/${params.id}`, {
          data: jsonString,
        });
      }
    };
  }, []);
  useEffect(() => {
    // TO SEND GRAPH DATA TO BACKEND WHEN INTERNETS COME BACK
    window.ononline = async (event) => {
      let jsonString = localStorage.getItem("tempGraphData");
      try {
        const { data } = await axios.post(`/paper/${params.id}`, {
          data: jsonString,
        });
        localStorage.removeItem("tempGraphData");
      } catch (error) {}
    };

    //     const getdata = async () => {
    //           let { data } = await axios.get('/user')
    //           if (data) {
    //             data=JSON.parse(data)
    //             graph.fromJSON(data)
    //           }
    //         }
    // getdata()
    setPaper(
      new dia.Paper({
        el: $("#paper"),
        width: "100%",
        height: "100vh",
        model: graph,
        cellViewNamespace: shapes,
        background: {
          color: "white",
          image: savedpaper.image,
          // image: 'https://healthcoach-fitness.s3.amazonaws.com/image3-1656269937815.png',
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
    var link5 = new shapes.standard.Link();
    link5.prop("source", { x: 30, y: 600 });
    link5.prop("target", { x: 30, y: 650 });
    // link5.prop('vertices', [{ x: 450, y: 700 }]);
    // link5.attr('root/title', 'joint.shapes.standard.Link');
    link5.attr("line/stroke", "#fe854f");

    shapes.standard.Rectangle.preFadeAux = shapes.standard.Rectangle.extend({
      markup:
        '<g class="rotatable"><g class="scalable"><rect class=""/></g><image/><text class="label"/></g>',

      defaults: util.deepSupplement(
        {
          type: "devs.MyImageModel",
          position: {
            x: 60,
            y: 530,
          },
          attrs: {
            image: {
              width: 100,
              height: 70,
              "xlink:href":
                "data:image/svg+xml;utf8," + encodeURIComponent(sales),
              preserveAspectRatio: "none",
            },
            ".label": {
              text: "Motor",
              fill: "red",
              y: 90,
            },
          },
        },
        shapes.standard.Rectangle.prototype.defaults
      ),
    });

    shapes.standard.Rectangle.MyImageModel = shapes.standard.Rectangle.extend({
      markup:
        '<g class="rotatable"><g class="scalable"><rect class=""/></g><image/><text class="label"/></g>',

      defaults: util.deepSupplement(
        {
          type: "devs.MyImageModel",
          position: {
            x: 60,
            y: 530,
          },
          attrs: {
            image: {
              width: 100,
              height: 70,
              "xlink:href":
                "data:image/svg+xml;utf8," + encodeURIComponent(sales),
              preserveAspectRatio: "none",
            },
            ".label": {
              text: "Motor",
              fill: "red",
              y: 90,
            },
          },
        },
        shapes.standard.Rectangle.prototype.defaults
      ),
    });

    shapes.standard.Rectangle.Fader = shapes.standard.Rectangle.extend({
      markup:
        '<g class="rotatable"><g class="scalable"><rect class=""/></g><image/><text class="label"/></g>',

      defaults: util.deepSupplement(
        {
          type: "standard.Fader",
          position: {
            x: 60,
            y: 530,
          },
          attrs: {
            image: {
              width: 70,
              height: 90,
              "xlink:href":
                "data:image/svg+xml;utf8," + encodeURIComponent(Fader),
              preserveAspectRatio: "none",
            },
            ".label": {
              text: "Fader",
              fill: "black",
              y: -14,
              x: -9,
            },
          },
        },
        shapes.standard.Rectangle.prototype.defaults
      ),
    });
    shapes.standard.Rectangle.FaderAux = shapes.standard.Rectangle.extend({
      markup:
        '<g class="rotatable"><g class="scalable"><rect class=""/></g><image/><text class="label"/></g>',

      defaults: util.deepSupplement(
        {
          type: "standard.Fader",
          res: "hiii",
          position: {
            x: 60,
            y: 530,
          },
          attrs: {
            image: {
              width: 70,
              height: 90,
              "xlink:href":
                "data:image/svg+xml;utf8," + encodeURIComponent(FadeAux),
              preserveAspectRatio: "none",
            },
            ".label": {
              text: "Post-fade Aux",
              fill: "black",
              y: 38,
              x: 69,
            },
          },
        },
        shapes.standard.Rectangle.prototype.defaults
      ),
    });
    //PORT DEFINED HERE
    var portsIn = {
      position: {
        name: "left",
      },
      attrs: {
        portBody: {
          magnet: true,
          r: 6,
          fill: "#023047",
          stroke: "#023047",
        },
      },
      label: {
        position: {
          name: "left",
          args: { y: 6 },
        },
        markup: [
          {
            tagName: "text",
            selector: "label",
            className: "label-text",
          },
        ],
      },
      markup: [
        {
          tagName: "circle",
          selector: "portBody",
        },
      ],
    };

    var portsOut = {
      position: {
        name: "right",
      },
      attrs: {
        portBody: {
          magnet: true,
          r: 6,
          fill: "#E6A502",
          stroke: "#023047",
        },
      },
      label: {
        position: {
          name: "right",
          args: { y: 6 },
        },
        markup: [
          {
            tagName: "text",
            selector: "label",
            className: "label-text",
          },
        ],
      },
      markup: [
        {
          tagName: "circle",
          selector: "portBody",
        },
      ],
    };
    //--------------------------------------------------->

    //---------------MOTOR SVG--------------------------->

    var generalModel = new shapes.standard.Rectangle.MyImageModel({
      size: {
        width: 100,
        height: 70,
      },
      position: {
        x: 30,
        y: 140,
      },
      // ports: {
      //   groups: {
      //     in: portsIn,
      //     out: portsOut,
      //   },
      // },
    });
    var faderShape = new shapes.standard.Rectangle.Fader({
      attr: {
        line: "red",
      },
      size: {
        width: 90,
        height: 90,
      },
      position: {
        x: 160,
        y: 470,
      },
      ports: {
        groups: {
          in: portsIn,
          out: portsOut,
        },
      },
    });
    faderShape.addPort(faderPort1);
    faderShape.addPort(faderPort2);
    var faderAuxShape = new shapes.standard.Rectangle.FaderAux({
      attr: {
        line: "red",
      },
      size: {
        width: 90,
        height: 90,
      },
      position: {
        x: 170,
        y: 590,
      },
      ports: {
        groups: {
          in: portsIn,
          out: portsOut,
        },
      },
    });

    faderAuxShape.addPort(fadeAutoPort1);
    faderAuxShape.addPort(fadeAutoPort2);
    let shapesFromDB = [];

    // Canvas where sape are dropped

    // Canvas from which you take shapesa
    var stencilGraph = new dia.Graph({}, { cellNamespace: shapes }),
      stencilPaper = new dia.Paper({
        el: $("#stencil"),
        model: stencilGraph,
        interactive: false,
        height: "100vh",
        width: "100%",
      });
    const fetchData = async () => {
      const { data } = await axios.get(`/shapes`);
      let count = 1;
      let x;
      let y = 15;
      data.map((item, index) => {
        if (index % 2 == 0) {
          x = 15;
        } else {
          x = 150;
        }
        let shape = JSON.parse(item.shapedata);
        shape.position = { x: x, y: y };
        shape.level = item.level;
        stencilGraph.addCell(shape);
        if (index % 2 !== 0) {
          y = y + 100;
        }
      });
    };
    fetchData();

    // stencilGraph.addCells([
    //   rectangleShape,
    //   circleShape,
    //   rhombusShape,
    //   EllipseShape,
    //   imageShape,
    //   atomicShape,
    //   generalModel.position(30, 430),

    //   subgroup,
    //   link5,
    //   faderShape,
    //   faderAuxShape,
    // ]);

    var infoButton = new elementTools.Button({
      focusOpacity: 0.5,
      distance: 60,
      x: "100%",
      y: "0%",
      offset: { x: -5, y: -5 },
      magnet: "body",
      action: function (evt) {
        let links = new shapes.standard.Link();
        link5.prop("source", { x: 1000, y: 100 });
        link5.prop("target", { x: 500, y: 650 });
        graph.addCell(links);
      },
      markup: [
        {
          tagName: "circle",
          selector: "button",
          attributes: {
            r: 7,
            fill: "#001DFF",
            cursor: "pointer",
          },
        },
        {
          tagName: "path",
          selector: "icon",
          attributes: {
            d: "M -2 4 2 4 M 0 3 0 0 M -2 -1 1 -1 M -1 -4 1 -4",
            fill: "none",
            stroke: "#FFFFFF",
            "stroke-width": 2,
            "pointer-events": "none",
          },
        },
      ],
    });

    // TO SELECT ELEMENT FROM THE STENCILPAPER
    if (paper) {
      //     var line = V("line", {
      //   x1: 1050,
      //   y1: 100,
      //   x2: 1050,
      //   y2: 800,
      //   stroke: "red",
      // });
      // var line2 = V("line", {
      //   x1: 1060,
      //   y1: 100,
      //   x2: 1060,
      //   y2: 800,
      //   stroke: "blue",
      // });
      // var line3 = V("line", {
      //   x1: 1080,
      //   y1: 100,
      //   x2: 1080,
      //   y2: 800,
      //   stroke: "yellow",
      // });
      // var line4 = V("line", {
      //   x1: 1070,
      //   y1: 100,
      //   x2: 1070,
      //   y2: 800,
      //   stroke: "green",
      // });

      // V(paper.viewport).append(line);
      // V(paper.viewport).append(line3);
      // V(paper.viewport).append(line4);
      // V(paper.viewport).append(line2);
      var boundaryTool = new elementTools.Boundary();
      var removeButton = new elementTools.Remove();
      var connecetTool = new elementTools.Connect();

      function getMarkup(angle = 0) {
        return [
          {
            tagName: "circle",
            selector: "button",
            attributes: {
              r: 7,
              fill: "#4666E5",
              stroke: "#FFFFFF",
              cursor: "pointer",
            },
          },
          {
            tagName: "path",
            selector: "icon",
            attributes: {
              transform: `rotate(${angle})`,
              d: "M -4 -1 L 0 -1 L 0 -4 L 4 0 L 0 4 0 1 -4 1 z",
              fill: "#FFFFFF",
              stroke: "none",
              "stroke-width": 2,
              "pointer-events": "none",
            },
          },
        ];
      }

      const connectRight = new elementTools.Connect({
        x: "100%",
        y: "50%",
        markup: getMarkup(0),
      });

      const connectBottom = new elementTools.Connect({
        x: "50%",
        y: "100%",
        markup: getMarkup(90),
      });
      const connectTop = new elementTools.Connect({
        x: "50%",
        y: "0%",
        markup: getMarkup(270),
      });
      const connectLeft = new elementTools.Connect({
        x: "0%",
        y: "50%",
        markup: getMarkup(180),
      });

      var toolsView = new dia.ToolsView({
        tools: [
          boundaryTool,
          removeButton,
          connectLeft,
          connectRight,
          connectBottom,
          connectTop,
        ],
      });
      var toolsView2 = new dia.ToolsView({
        tools: [connectTop],
      });

      paper.on("link:pointerdown", (linkView) => {
        linkView.addTools(toolsView2);
        setSizeChange(false);
        setShowColorsoption(true);
        setSelectLink(linkView);
      });

      // TO REMOVE TOOLS FROM ELEMENT AND LINK WHERE MOUSE LEAVE FROM ELEMENT OR LINK
      // paper.on("cell:mouseleave", function (linkView) {
      //   linkView.removeTools();
      // });
      // paper.on("link:mouseleave", function (linkView) {
      //   linkView.removeTools();
      // });

      //-------------------------------------------------------------------------------->

      //EVENT FOR ELEMENT MOUSE PONTER DOWN
      paper.on("cell:pointerdown", function (cellView, e, x, y) {
        if (!cellView.model.isLink()) {
          cellView.addTools(toolsView);
          setSizeChange(true);
          setShowColorsoption(false);
          setShowColors(false);
        }
        setElement(cellView);
      });

      //-------------------------------------------------------------------------------->

      paper.on("change:position", async function (cell) {});
      paper.on("cell:pointerup", async function (cell) {
        let jsonObject = graph.toJSON();
        console.log(">>>>", jsonObject);
        let jsonString = JSON.stringify(jsonObject);

        if (navigator.onLine) {
          const { data } = await axios.post(`/paper/${params.id}`, {
            data: jsonString,
          });
        } else {
          localStorage.setItem("tempGraphData", jsonString);
        }
      });

      // EVENT FOR COPY ELEMENT FROM THE STENCILPAPER AND PASTE TO THE PAPER

      stencilPaper.on("cell:pointerdown", function (cellView, e, x, y) {
        let data = cellView.model.getBBox();

        $("body").append(
          '<div id="flyPaper" style="position:fixed;z-index:100;opacity:.7;pointer-event:none;"></div>'
        );
        var fly = $("#flyPaper");
        var flyGraph = new dia.Graph({}, { cellNamespace: shapes }),
          flyPaper = new dia.Paper({
            el: $("#flyPaper"),
            model: flyGraph,
            width: data.width,
            height: data.height,
            interactive: false,
          }),
          flyShape = cellView.model.clone(),
          pos = cellView.model.position(),
          offset = {
            x: x - pos.x,
            y: y - pos.y,
          };

        flyShape.position(0, 0);
        console.log(flyShape);
        flyGraph.addCell(flyShape);
        $("#flyPaper").offset({
          left: e.pageX - offset.x,
          top: e.pageY - offset.y,
        });

        $("body").on("mousemove.fly", function (e) {
          $("#flyPaper").offset({
            left: e.pageX - offset.x,
            top: e.pageY - offset.y,
          });
        });
        $("body").on("mouseup.fly", function (e) {
          var x = e.pageX,
            y = e.pageY,
            target = paper.$el.offset();

          // Dropped over paper ?

          if (
            x > target.left &&
            x < target.left + paper.$el.width() &&
            y > target.top &&
            y < target.top + paper.$el.height()
          ) {
            var s = flyShape.clone();
            s.position(x - target.left - offset.x, y - target.top - offset.y);
            // s.addPorts([
            //   {
            //     group: "in",
            //     attrs: { label: { text: "in1" } },
            //   },
            //   {
            //     group: "in",
            //     attrs: { label: { text: "in2" } },
            //   },
            //   {
            //     group: "out",
            //     attrs: { label: { text: "out" } },
            //   },
            //   {
            //     group: "out",
            //     attrs: { label: { text: "out" } },
            //   },
            // ]);
            graph.addCell(s);
          }

          let jsonObject = graph.toJSON();
          let jsonString = JSON.stringify(jsonObject);
          $("body").off("mousemove.fly").off("mouseup.fly");
          flyShape.remove();
          $("#flyPaper").remove();
        });
      });
      //-------------------------------------------------------------------------------->
    }
  }, [paper]);

  // TO HANDLE LINK COLOR
  const handleLinkColor = (color) => {
    selectLink.model.attr("line/stroke", color);
  };

  const handelerconnectionStyle = (style) => {
    selectLink.model.connector(style);
  };

  //TO HANDLE LINK STYLE
  const handelerlinkStyle = (style) => {
    if (style === "dashes") {
      selectLink.model.attr({
        line: {
          strokeWidth: 4,
          strokeDasharray: "2 2",
          sourceMarker: {
            type: "image",
            "xlink:href":
              "http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png",
            width: 24,
            height: 24,
            y: -12,
          },
          targetMarker: {
            type: "image",
            "xlink:href":
              "http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png",
            width: 24,
            height: 24,
            y: -12,
          },
        },
      });
    } else if (style === "solid") {
      selectLink.model.attr({
        line: {
          strokeWidth: 2,
          strokeDasharray: "0 0",
          sourceMarker: {
            type: "image",
            "xlink:href":
              "http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png",
            width: 24,
            height: 24,
            y: -12,
          },
          targetMarker: {
            type: "image",
            "xlink:href":
              "http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png",
            width: 24,
            height: 24,
            y: -12,
          },
        },
      });
    }
  };

  //TO HANDLE LINK SIZE
  const handleLinkSize = (size) => {
    selectLink.model.attr({
      line: {
        strokeWidth: size,
      },
    });
  };

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

  const zoomOut = () => {
    paper.scale(zoomCount - 1);
    setZoomCount(zoomCount - 1);
  };
  const zoomIn = () => {
    paper.scale(zoomCount + 1);
    setZoomCount(zoomCount + 1);
  };

  // TO ADD VERTICAL LINE
  const handleAddLine = () => {
    var shadowLink = new shapes.standard.Link();
    shadowLink.prop("source", { x: 300, y: 70 });
    shadowLink.prop("target", { x: 300, y: 300 });
    shadowLink.attr("line", { targetMarker: { type: "none" } });
    shadowLink.label(0, {
      markup: [
        {
          tagName: "rect",
          selector: "body",
        },
        {
          tagName: "text",
          selector: "label",
        },
      ],
      attrs: {
        body: {
          fill: "white", // white background
        },
        label: {
          text: "my label", // text to show
          fill: "black  ", // blue text
        },
      },
      position: {
        distance: 0, // midway on the connection path
        offset: {
          x: 0, // 10 local x units to the right
          y: 250, // 5 local y units above
        },

        args: {
          keepGradient: true, // auto-rotate by path slope at distance
          ensureLegibility: true, // auto-rotate label if upside-down
        },
      },
    });
    shadowLink.attr("line/stroke", "#5654a0");
    shadowLink.addTo(graph);
  };

  const handleLinkLabel = () => {
    selectLink.model.label(0, {
      markup: [
        {
          tagName: "rect",
          selector: "body",
        },
        {
          tagName: "text",
          selector: "label",
        },
      ],
      attrs: {
        body: {
          fill: "white", // white background
        },
        label: {
          text: textValue, // text to show
          fill: "black  ", // blue text
        },
      },
      position: {
        distance: 0, // midway on the connection path
        offset: {
          x: 0, // 10 local x units to the right
          y: 650, // 5 local y units above
        },

        args: {
          keepGradient: true, // auto-rotate by path slope at distance
          ensureLegibility: true, // auto-rotate label if upside-down
        },
      },
    });
  };
  var commandManager = new dia.CommandManager({ graph: graph });
  const handleUndo = () => {
    commandManager.undo();
  };

  const handleRedo = () => {
    commandManager.redo();
  };
  return (
    <div className="main-div">
      <Row className="main-row ">
        <div className="col1">
          <div id="stencil"></div>
        </div>
        <Col id="total" className="col2">
          <Tools
            downloadImage={downloadImage}
            handleAddLine={handleAddLine}
            handleUndo={handleUndo}
            handleRedo={handleRedo}
            graph={graph}
            zoomOut={zoomOut}
            zoomIn={zoomIn}
            id={params.id}
          />
          <div className="col2-div">
            <div id="paper"></div>
          </div>
        </Col>
        {/* <Col className="col3" >
          <div className="div3"></div>
          {sizeChange && (
            <div className="size">
              <Form.Select
                className="size-select"
                onChange={(e) => {
                  SetSelectWidth(e.target.value);
                }}
                aria-label="Default select example"
              >
                <option>Width</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="150">150</option>
                <option value="200">200</option>
                <option value="250">250</option>
                <option value="300">300</option>
                <option value="350">350</option>
                <option value="400">400</option>
                <option value="450">450</option>
                <option value="500">500</option>
              </Form.Select>
              <Form.Select
                className="size-select"
                onChange={(e) => {
                  SetSelectHeight(e.target.value);
                }}
                aria-label="Default select example"
              >
                <option>Height</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="150">150</option>
                <option value="200">200</option>
                <option value="250">250</option>
                <option value="300">300</option>
                <option value="350">350</option>
                <option value="400">400</option>
                <option value="450">450</option>
                <option value="500">500</option>
              </Form.Select>
              <button onClick={handleElementSize}>OK</button>
            </div>
          )}
          {showColorsOption && (
            <>
              <div className="choose-color">
                <h2 style={{ color: "white" }}>Color</h2>
                <img
                  alt="color"
                  onClick={() => {
                    setShowColors(!showColors);
                  }}
                  className="mt-2"
                  width={"30px"}
                  height={"30px"}
                  src="/images/chromatic.png"
                ></img>
              </div>
            </>
          )}

          {showColors && (
            <div className="color-div">
              <div className="color-div2">
                <div
                  style={{ backgroundColor: "red" }}
                  onClick={() => {
                    handleLinkColor("red");
                  }}
                  className="colorss"
                ></div>
                <div
                  style={{ backgroundColor: "brown" }}
                  className="colorss"
                  onClick={() => {
                    handleLinkColor("brown");
                  }}
                ></div>
                <div
                  style={{ backgroundColor: "black" }}
                  className="colorss"
                  onClick={() => {
                    handleLinkColor("black");
                  }}
                ></div>
              </div>

              <div className="color-div2">
                <div
                  style={{ backgroundColor: "green" }}
                  className="colorss"
                  onClick={() => {
                    handleLinkColor("green");
                  }}
                ></div>
                <div
                  style={{ backgroundColor: "yellow" }}
                  className="colorss"
                  onClick={() => {
                    handleLinkColor("yellow");
                  }}
                ></div>
                <div
                  style={{ backgroundColor: "white" }}
                  className="colorss"
                  onClick={() => {
                    handleLinkColor("white");
                  }}
                ></div>
              </div>

              <div className="color-div2">
                <div
                  style={{ backgroundColor: "red" }}
                  className="colorss"
                ></div>
                <div
                  style={{ backgroundColor: "blue" }}
                  className="colorss"
                  onClick={() => {
                    handleLinkColor("blue");
                  }}
                ></div>
                <div
                  style={{ backgroundColor: "black" }}
                  className="colorss"
                  onClick={() => {
                    handleLinkColor("black");
                  }}
                ></div>
              </div>
            </div>
          )}
          {showColorsOption && (
            <div className=" mt-5 connection-main">
              <p> Connection style</p>

              <div className="connections">
                <div className="connection-inner">
                  <div
                    className="connect"
                    onClick={() => {
                      handelerconnectionStyle("normal");
                    }}
                  >
                    <img alt="angle" src="/images/angle.png"></img>
                  </div>
                  <div
                    className="connect"
                    onClick={() => {
                      handelerconnectionStyle("rounded");
                    }}
                  >
                    <img alt="round" src="/images/half.png"></img>
                  </div>
                  <div
                    className="connect"
                    onClick={() => {
                      handelerconnectionStyle("curve");
                    }}
                  >
                    <img alt="round2" src="/images/round.png"></img>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showColorsOption && (
            <div className="mt-5">
              <p style={{ color: "white" }}>Link style</p>
              <Form.Select
                className="size-select"
                onChange={(e) => {
                  handelerlinkStyle(e.target.value);
                }}
                aria-label="Default select example"
              >
                <option value="solid">Solid</option>
                <option value="dotted">Dotted</option>
                <option value="dashes">Dashes</option>
              </Form.Select>
            </div>
          )}

          {showColorsOption && (
            <>
              <div>
                <p style={{ color: "white" }}>Link thickness</p>
                <div className="thick-main">
                  <div className="thick-inner">
                    <div
                      className="thick"
                      onClick={() => {
                        handleLinkSize(2);
                      }}
                    >
                      <img alt="2" width={"100%"} src="/images/1.png"></img>
                    </div>
                    <div
                      className="thick"
                      onClick={() => {
                        handleLinkSize(4);
                      }}
                    >
                      <img alt="4" width={"100%"} src="/images/2.png"></img>
                    </div>
                    <div
                      className="thick"
                      onClick={() => {
                        handleLinkSize(6);
                      }}
                    >
                      <img alt="6" width={"100%"} src="/images/3.png"></img>
                    </div>
                    <div
                      className="thick"
                      onClick={() => {
                        handleLinkSize(8);
                      }}
                    >
                      <img alt="8" width={"100%"} src="/images/4.png"></img>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <p style={{ color: "white" }}>Text</p>
                <input
                  type={"text"}
                  onBlur={handleLinkLabel}
                  onChange={(e) => {
                    setTextValue(e.target.value);
                  }}
                />
              </div>
            </>
          )}
        </Col> */}
      </Row>
      <canvas id="newcanvas2"></canvas>
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
    </div>
  );
}

export default App;
