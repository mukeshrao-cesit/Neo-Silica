import React, { useEffect, useState } from "react";
import "./PaperScreen.css";
import { dia, elementTools, format, shapes, ui, util } from "@clientio/rappid";
import axios from "../../util/axiosConfig.js";
import { useParams } from "react-router-dom";

const PaperScreen = () => {
  //STATES FOR PAPER
  const [paper, setPaper] = useState();
  const [graph, setGraph] = useState(
    new dia.Graph({}, { cellNamespace: shapes })
  );
  const params = useParams();
  const [jsonData, setJsonData] = useState();
  const [savedpaper, setSavedPaper] = useState({});

  useEffect(() => {
    setPaper(
      new dia.Paper({
        el: $("#paper"),
        width: "100%",
        height: "1000px",
        model: graph,
        cellViewNamespace: shapes,
        // background: {
        //   color: "white",
        //   image: "/images/d.png",
        //   // image: 'https://healthcoach-fitness.s3.amazonaws.com/image3-1656269937815.png',
        //   position: { x: 0, y: 0 },
        //   size: { width: 1200, height: 1000 },
        // },
        defaultLink: () =>
          new dia.Link({
            attrs: { ".marker-target": { d: "M 10 0 L 0 5 L 10 10 z" } },
          }),
      })
    );

    const fetchData = async () => {
      const { data } = await axios.get(`/paper/${params.id}`);
      if (data.jsondata) {
        setJsonData(JSON.parse(data.jsondata));
      }
      setSavedPaper(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (paper && jsonData) {
      console.log("data from database",jsonData);
      let result = [];
      let paperWidth = Math.round(paper.$el.width());
      let TotalShapes = jsonData.cells.filter((item) => {
        if (item.type !== "link") {
          return item;
        }
      });

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
      //---------------------------------------  LEVEL 1 ---------------------------------------->>
      //shapeWidthLevel1: here we are calculating level one shape width
      let shapeWidthLevel1 =
        Math.round(paperWidth / level1.length) - (5 * level1.length + 2);
      //spaceLevel1: here we are calculating level one space length
      let spaceLevel1 = paper.$el.width() - shapeWidthLevel1 * level1.length;
      spaceLevel1 = spaceLevel1 / level1.length + 2;
      let posXLevel1 = spaceLevel1;
      let posYLevel1 = 10;
      // targetPortsArray is used to store port x value and y value
      let targetPortsArray = [];
      let xValue = spaceLevel1 + shapeWidthLevel1 / 2;
      // This loop is used for creating  n number of rectangle shapes
      for (let i = 0; i < level1.length; i++) {
        targetPortsArray.push({ x: xValue, y: 130 });
        //Creating rectangle shapes
        const rectangleShape = new shapes.basic.Rect({
          position: {
            x: posXLevel1,
            y: posYLevel1,
          },
          size: {
            width: shapeWidthLevel1,
            height: 90,
          },
          attrs: {
            text: {
              text: `Level 1 `,
            },
          },
        });
        //Creating ports
        var Level1ShapePort = {
          label: {
            position: {
              name: "right",
            },
            markup: [
              {
                tagName: "text",
                selector: "label",
              },
            ],
          },
          attrs: {
            portBody: {
              magnet: true,
              width: 1,
              height: 6,
              x: shapeWidthLevel1 / 2,
              y: 45,
              fill: "black",
            },
          },
          markup: [
            {
              tagName: "rect",
              selector: "portBody",
            },
          ],
        };
        rectangleShape.addPort(Level1ShapePort);
        result.push(rectangleShape);
        posXLevel1 = posXLevel1 + spaceLevel1 + shapeWidthLevel1;
        xValue = xValue + shapeWidthLevel1 + spaceLevel1;
      }
      //adding the shapes to the graph
      graph.addCell(result);
      let underlineLength =
        posXLevel1 -
        shapeWidthLevel1 / 2 -
        spaceLevel1 -
        (spaceLevel1 + shapeWidthLevel1 / 2);
        //shadowlink we created for the horizondal line
      var shadowLink = new shapes.standard.Link();
      shadowLink.prop("source", {
        x: spaceLevel1 + shapeWidthLevel1 / 2,
        y: 130,
      });
      shadowLink.prop("target", {
        x: posXLevel1 - shapeWidthLevel1 / 2 - spaceLevel1,
        y: 130,
      });
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
      });
      shadowLink.attr("line/stroke", "black");
      //adding first horizondal line to the graph
      shadowLink.addTo(graph);
      let drawData = graph.toJSON();
      let cells = drawData.cells;
      for (let i = 0; i < cells.length; i++) {
        if (
          cells[i].type !== "standard.Link" &&
          !cells[i].type.includes("link")
        ) {
          var shadowLink = new dia.Link();
          shadowLink.prop("source", {
            id: cells[i].id,
            magnet: "portBody",
            port: cells[i].ports.items[0].id,
          });
          shadowLink.prop("target", targetPortsArray[i]);
          shadowLink.addTo(graph);
        }
      }

    if(level2.length>0){
      const ConnectionRectangle1 = new shapes.basic.Rect({
        position: {
          x: spaceLevel1 + shapeWidthLevel1 / 2 + (underlineLength / 2 - 30),
          y: 130,
        },
        size: {
          width: 60,
          height: 20,
        },
        attrs: {
          text: {
            text: `connect `,
          },
        },
      });
      const ConnectionRectangle2 = new shapes.basic.Rect({
        position: {
          x: spaceLevel1 + shapeWidthLevel1 / 2 + (underlineLength / 2 - 30),
          y: 180,
        },
        size: {
          width: 60,
          height: 20,
        },
        attrs: {
          text: {
            text: `connect `,
          },
        },
      });
      graph.addCell([ConnectionRectangle1,ConnectionRectangle2]);
      var link = new dia.Link();
        link.source(ConnectionRectangle1);
        link.target(ConnectionRectangle2);
        link.addTo(graph);
      var subgroupPort1 = {
        label: {
          position: {
            name: "right",
          },
          markup: [
            {
              tagName: "text",
              selector: "label",
            },
          ],
        },
        attrs: {
          portBody: {
            magnet: true,
            width: 0,
            height: 6,
            x: 30,
            y: 15,
            fill: "black",
          },
        },
        markup: [
          {
            tagName: "rect",
            selector: "portBody",
          },
        ],
      };
      ConnectionRectangle1.addPort(subgroupPort1);
    }
   
      ////---------------------------------------LEVEL 1  closed ----------------------------------------
      ////---------------------------------------LEVEL 2  start ----------------------------------------

      let shapeWidthLevel2 =
        Math.round(paperWidth / level2.length) - (5 * level2.length + 2);
      let spaceLevel2 = paper.$el.width() - shapeWidthLevel2 * level2.length;
      spaceLevel2 = spaceLevel2 / level2.length + 2;
      let posXLevel2 = spaceLevel2;
      let posYLevel2 = 250;
      targetPortsArray.length = 0;
      xValue = spaceLevel2 + shapeWidthLevel2 / 2;
      result = [];
      for (let i = 0; i < level2.length; i++) {
        targetPortsArray.push({ x: xValue, y: 400 });
        const rectangleShape = new shapes.basic.Rect({
          position: {
            x: posXLevel2,
            y: posYLevel2,
          },
          size: {
            width: shapeWidthLevel2,
            height: 90,
          },
          attrs: {
            text: {
              text: `Level 2 `,
            },
          },
        });
        var subgroupPort1 = {
          label: {
            position: {
              name: "right",
            },
            markup: [
              {
                tagName: "text",
                selector: "label",
              },
            ],
          },
          attrs: {
            portBody: {
              magnet: true,
              width: 1,
              height: 6,
              x: shapeWidthLevel2 / 2,
              y: 23,
              fill: "green",
            },
          },
          markup: [
            {
              tagName: "rect",
              selector: "portBody",
            },
          ],
        };
        var subgroupPort2 = {
          label: {
            position: {
              name: "right",
            },
            markup: [
              {
                tagName: "text",
                selector: "label",
              },
            ],
          },
          attrs: {
            portBody: {
              magnet: true,
              width: 1,
              height: 6,
              x: shapeWidthLevel2 / 2,
              y: -28,
              fill: "black",
            },
          },
          markup: [
            {
              tagName: "rect",
              selector: "portBody",
            },
          ],
        };
        rectangleShape.addPort(subgroupPort2);
        rectangleShape.addPort(subgroupPort1);

        result.push(rectangleShape);
        posXLevel2 = posXLevel2 + spaceLevel2 + shapeWidthLevel2;
        xValue = xValue + shapeWidthLevel2 + spaceLevel2;
      }
      graph.addCell(result);
      let underlineLength2 =
        posXLevel2 -
        shapeWidthLevel2 / 2 -
        spaceLevel2 -
        (spaceLevel2 + shapeWidthLevel2 / 2);

      var shadowLink = new shapes.standard.Link();
      shadowLink.prop("source", {
        x: spaceLevel2 + shapeWidthLevel2 / 2,
        y: 400,
      });
      shadowLink.prop("target", {
        x: posXLevel2 - shapeWidthLevel2 / 2 - spaceLevel2,
        y: 400,
      });
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
            y: 650, // 5 local y units above
          },

          args: {
            keepGradient: true, // auto-rotate by path slope at distance
            ensureLegibility: true, // auto-rotate label if upside-down
          },
        },
      });
      shadowLink.attr("line/stroke", "black");
      shadowLink.addTo(graph);
      var shadowLink = new shapes.standard.Link();
      shadowLink.prop("source", {
        x: spaceLevel2 + shapeWidthLevel2 / 2,
        y: 200,
      });
      shadowLink.prop("target", {
        x: posXLevel2 - shapeWidthLevel2 / 2 - spaceLevel2,
        y: 200,
      });
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
      });
      shadowLink.attr("line/stroke", "black");
      shadowLink.addTo(graph);
      drawData = graph.toJSON();
      cells = drawData.cells;
      cells = drawData.cells.filter((item) => {
        let pos = item.position;
        if (item.type !== "standard.Link" && !item.type.includes("link")) {
          if (pos["y"] === 250) {
            return item;
          }
        }
      });
      for (let i = 0; i < cells.length; i++) {
        if (
          cells[i].type !== "standard.Link" &&
          !cells[i].type.includes("link")
        ) {
          var shadowLink = new dia.Link();
          var shadowLink1 = new dia.Link();
          shadowLink1.prop("source", {
            id: cells[i].id,
            magnet: "portBody",
            port: cells[i].ports.items[1].id,
          });
          shadowLink1.prop("target", targetPortsArray[i]);
          // shadowLink.source(cells[i].ports.items[0].id)
          shadowLink.prop("source", {
            id: cells[i].id,
            magnet: "portBody",
            port: cells[i].ports.items[0].id,
          });
          shadowLink.prop("target", { x: targetPortsArray[i].x, y: 200 });
          shadowLink.addTo(graph);
          shadowLink1.addTo(graph);
        }
      }



if(level3.length>0){
        const ConnectionRectangle3 = new shapes.basic.Rect({
        position: {
          x: spaceLevel1 + shapeWidthLevel1 / 2 + (underlineLength / 2 - 30),
          y: 400,
        },
        size: {
          width: 60,
          height: 20,
        },
        attrs: {
          text: {
            text: `connect `,
          },
        },
      });
      const ConnectionRectangle4 = new shapes.basic.Rect({
        position: {
          x: spaceLevel1 + shapeWidthLevel1 / 2 + (underlineLength / 2 - 30),
          y: 480,
        },
        size: {
          width: 60,
          height: 20,
        },
        attrs: {
          text: {
            text: `connect `,
          },
        },
      });
      graph.addCell([ConnectionRectangle3,ConnectionRectangle4]);
      var link = new dia.Link();
        link.source(ConnectionRectangle3);
        link.target(ConnectionRectangle4);
        link.addTo(graph);
}
      ////---------------------------------------LEVEL 2  closed ----------------------------------------

      ////---------------------------------------LEVEL 3 Started   ----------------------------------------
      let shapeWidthLevel3 =
        Math.round(paperWidth / level3.length) - (5 * level3.length + 2);
      let spaceLevel3 = paper.$el.width() - shapeWidthLevel3 * level3.length;
      spaceLevel3 = spaceLevel3 / level3.length + 2;
      let posXLevel3 = spaceLevel3;
      let posYLevel3 = 600;
      targetPortsArray.length = 0;
      xValue = spaceLevel3 + shapeWidthLevel3 / 2;
      result = [];
      for (let i = 0; i < level3.length; i++) {
        targetPortsArray.push({ x: xValue, y: 800 });
        const rectangleShape = new shapes.basic.Rect({
          position: {
            x: posXLevel3,
            y: posYLevel3,
          },
          size: {
            width: shapeWidthLevel3,
            height: 90,
          },
          attrs: {
            text: {
              text: `Level 3 `,
            },
          },
        });
        var subgroupPort1 = {
          label: {
            position: {
              name: "right",
            },
            markup: [
              {
                tagName: "text",
                selector: "label",
              },
            ],
          },
          attrs: {
            portBody: {
              magnet: true,
              width: 1,
              height: 6,
              x: shapeWidthLevel3 / 2,
              y: 68,
              fill: "black",
            },
          },
          markup: [
            {
              tagName: "rect",
              selector: "portBody",
            },
          ],
        };
        var subgroupPort2 = {
          label: {
            position: {
              name: "right",
            },
            markup: [
              {
                tagName: "text",
                selector: "label",
              },
            ],
          },
          attrs: {
            portBody: {
              magnet: true,
              width: 1,
              height: 6,
              x: shapeWidthLevel3 / 2,
              y: -73,
              fill: "black",
            },
          },
          markup: [
            {
              tagName: "rect",
              selector: "portBody",
            },
          ],
        };
        rectangleShape.addPort(subgroupPort1);
        rectangleShape.addPort(subgroupPort2);

        result.push(rectangleShape);
        posXLevel3 = posXLevel3 + spaceLevel3 + shapeWidthLevel3;
        xValue = xValue + shapeWidthLevel3 + spaceLevel3;
      }
      graph.addCell(result);
      var shadowLink = new shapes.standard.Link();
      shadowLink.prop("source", {
        x: spaceLevel3 + shapeWidthLevel3 / 2,
        y: 800,
      });
      shadowLink.prop("target", {
        x: posXLevel3 - shapeWidthLevel3 / 2 - spaceLevel3,
        y: 800,
      });
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
      });
      shadowLink.attr("line/stroke", "black");
      shadowLink.addTo(graph);
      drawData = graph.toJSON();
      cells = drawData.cells;
      cells = drawData.cells.filter((item) => {
        let pos = item.position;
        if (item.type !== "standard.Link" && !item.type.includes("link")) {
          if (pos["y"] === 600) {
            return item;
          }
        }
      });
      var shadowLink = new shapes.standard.Link();
      shadowLink.prop("source", {
        x: spaceLevel3 + shapeWidthLevel3 / 2,
        y: 500,
      });
      shadowLink.prop("target", {
        x: posXLevel3 - shapeWidthLevel3 / 2 - spaceLevel3,
        y: 500,
      });
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
      });
      shadowLink.attr("line/stroke", "black");
      shadowLink.addTo(graph);
      for (let i = 0; i < cells.length; i++) {
        if (
          cells[i].type !== "standard.Link" &&
          !cells[i].type.includes("link")
        ) {
          var shadowLink = new dia.Link();
          var shadowLink1 = new dia.Link();
          shadowLink1.prop("source", {
            id: cells[i].id,
            magnet: "portBody",
            port: cells[i].ports.items[0].id,
          });
          shadowLink1.prop("target", targetPortsArray[i]);
          // shadowLink.source(cells[i].ports.items[0].id)
          shadowLink.prop("source", {
            id: cells[i].id,
            magnet: "portBody",
            port: cells[i].ports.items[1].id,
          });
          shadowLink.prop("target", { x: targetPortsArray[i].x, y: 500 });
          shadowLink.addTo(graph);
          shadowLink1.addTo(graph);
        }
      }
      //------------------------------------------------------------------------------------------------------
    }
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
    <div className="papermainDiv">
      <div className="paperleftDiv">
        <div className="paperhead">Neo Silica</div>
      </div>
      <div className="papermidtDiv">
        {/* <div className="PaperTool">Toolbar</div> */}
        <div id="paper"></div>
      </div>
    </div>
  );
};

export default PaperScreen;
