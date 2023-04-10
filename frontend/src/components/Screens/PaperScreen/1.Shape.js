export const q1Shape = (
  shapes,
  papersWidth,
  shapeWidth,
  level,
  graph,
  result
) => {
  let space = papersWidth - shapeWidth * level.length;
  space = Math.round(space / (level.length + 1));
  let posX = space;
  let flag = 0;
  let posY = 40;
  let CondensorArray = [];
  let SpringCondensorArray = [];
  for (let i = 0; i < level.length; i++) {
    if (level[i].attrs.text.text === "Spring Condensor") {
      flag++;
      SpringCondensorArray.push(level[i]);
    } else {
      CondensorArray.push(level[i]);
    }
  }
  CondensorArray = CondensorArray.concat(SpringCondensorArray);
  // targetPortsArray is used to store port x value and y value
  let targetPortsArray = [];
  let xValue = space + shapeWidth / 2;
  let totalTR = 0;
  // This loop is used for creating  n number of rectangle shapes
  for (let i = 0; i < CondensorArray.length; i++) {
    targetPortsArray.push({ x: xValue, y: 130 });
    totalTR += Math.round(CondensorArray[i].TR);
    //Creating rectangle shapes
    const rectangleShape = new shapes.basic.Circle({
      position: {
        x: posX,
        y: posY,
      },
      size: {
        width: 90,
        height: 60,
      },
      attrs: {
        circle: {
          fill: "rgb(52, 75, 207)",
          stroke: "rgb(52, 75, 207)",
        },
        text: {
          text: `Q${i + 1}\n\nTR ${Math.round(CondensorArray[i].TR)} `,
          fill: "#ffffff",
          fontWeight: "600",
          fontSize: "10",
        },
      },
    });
    //Creating ports
    var shapePort = {
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
          width: 5,
          height: 10,
          x: shapeWidth / 2 - 2,
          y: 30,
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
    rectangleShape.addPort(shapePort);
    result.push(rectangleShape);
    posX = posX + space + shapeWidth;
    xValue = xValue + shapeWidth + space;
  }
  let underlineLength =
    posX - shapeWidth / 2 - space - (space + shapeWidth / 2);
  var connectPoint = underlineLength / (level.length - 1);
  var horizondalLink = new shapes.standard.Link();
  var dottedLink = new shapes.standard.Link();
  let potnX;
  if (flag === 0) {
    horizondalLink.prop("source", {
      x: space + shapeWidth / 2,
      y: 130,
    });
    horizondalLink.prop("target", {
      x: posX - shapeWidth / 2 - space,
      y: 130,
    });
    horizondalLink.attr("line", { targetMarker: { type: "none" } });
    horizondalLink.label(0, {
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
    horizondalLink.attr("line/stroke", "black");
  } else {
    potnX = posX - shapeWidth * flag - space * flag;
    horizondalLink.prop("source", {
      x: space + shapeWidth / 2,
      y: 130,
    });
    horizondalLink.prop("target", {
      x: potnX - shapeWidth / 2 - space,
      y: 130,
    });
    horizondalLink.attr("line", { targetMarker: { type: "none" } });
    horizondalLink.label(0, {
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
    horizondalLink.attr("line/stroke", "black");

    // dotted link
    dottedLink.prop("source", {
      x: potnX - shapeWidth / 2 - space,
      y: 130,
    });
    dottedLink.prop("target", {
      x: posX - shapeWidth / 2 - space,
      y: 130,
    });
    dottedLink.attr("line", { targetMarker: { type: "none" } });
    dottedLink.attr({
      line: {
        stroke: "gray",
        strokeWidth: 3,
        strokeDasharray: "5 5",
      },
    });
  }
  dottedLink.prop("source", {
    id: horizondalLink.id,
    anchor: {
      name: "connectionLength",
      args: { length: potnX },
    },
  });
  horizondalLink.addTo(graph);
  dottedLink.addTo(graph);
  return {
    flag: flag,
    posX: posX,
    potnX: potnX,
    space: space,
    targetPortsArray: targetPortsArray,
    underlineLength: underlineLength,
    connectPoint: connectPoint,
    horizondalLink: horizondalLink,
    dottedLink: dottedLink,
    connectPoint: connectPoint,
    totalTR: totalTR,
  };
};

export const verticalLine1 = (
  shapes,
  flag,
  horizondalStarts,
  horizontalLine,
  dottedLink,
  dia,
  graph,
  connectPoint
) => {
  let cells = graph.toJSON().cells;
  let nl = 0;
  let dottedLinkStarts = Math.round(connectPoint);
  let newCells = [];
  cells.forEach((elem) => {
    if (elem.type !== "standard.Link" && !elem.type.includes("link")) {
      nl++;
      newCells.push(elem);
    }
  });

  nl = nl - flag;
  if (flag === 0) {
    for (let i = 0; i < newCells.length; i++) {
      let horizondalLink = new dia.Link();
      horizondalLink.prop("source", {
        id: newCells[i].id,
        magnet: "portBody",
        port: newCells[i].ports.items[0].id,
      });

      horizondalLink.prop("target", {
        id: horizontalLine.id,
        anchor: {
          name: "connectionLength",
          args: { length: horizondalStarts },
        },
      });

      horizondalStarts += Math.round(connectPoint);
      // console.log(linkView.model.target());
      horizondalLink.addTo(graph);
    }
  } else {
    for (let i = 0; i < newCells.length; i++) {
      let horizondalLink = new dia.Link();
      let dottedVerticalLink = new shapes.standard.Link({
        attrs: {
          line: {
            stroke: "gray",
            strokeWidth: 3,
            strokeDasharray: "5 5",
          },
        },
      });
      dottedVerticalLink.attr("line", { targetMarker: { type: "none" } });
      if (i < nl) {
        horizondalLink.prop("source", {
          id: newCells[i].id,
          magnet: "portBody",
          port: newCells[i].ports.items[0].id,
        });
        horizondalLink.prop("target", {
          id: horizontalLine.id,
          anchor: {
            name: "connectionLength",
            args: { length: horizondalStarts },
          },
        });
        horizondalStarts += Math.round(connectPoint);
      } else {
        dottedVerticalLink.prop("source", {
          id: newCells[i].id,
          magnet: "portBody",
          port: newCells[i].ports.items[0].id,
        });
        dottedVerticalLink.prop("target", {
          id: dottedLink.id,
          anchor: {
            name: "connectionLength",
            args: { length: dottedLinkStarts },
          },
        });
        dottedLinkStarts += Math.round(connectPoint);
      }

      // console.log(linkView.model.target());
      horizondalLink.addTo(graph);
      dottedVerticalLink.addTo(graph);
    }
  }
};
