export const q1Shape = (
  dia,
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
  let posY = 40;
  let flag = 0;
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
    let potnX = posX - shapeWidth * flag - space * flag;
    console.log(potnX, posX, space);
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
    dottedLink.router("orthogonal");
    dottedLink.connector("rounded");
    dottedLink.attr({
      line: {
        stroke: "gray",
        strokeWidth: 4,
        strokeDasharray: "4 2",
      },
    });
  }
  console.log(horizondalLink, dottedLink);
  horizondalLink.addTo(graph);
  dottedLink.addTo(graph);

  return {
    posX: posX,
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
  horizondalStarts,
  horizontalLine,
  dia,
  graph,
  connectPoint
) => {
  let cells = graph.toJSON().cells;
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].type !== "standard.Link" && !cells[i].type.includes("link")) {
      var horizondalLink = new dia.Link();
      horizondalLink.prop("source", {
        id: cells[i].id,
        magnet: "portBody",
        port: cells[i].ports.items[0].id,
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
  }
};
