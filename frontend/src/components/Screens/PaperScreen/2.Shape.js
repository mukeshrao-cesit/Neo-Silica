export const q2Shape = (
  shapes,
  papersWidth,
  shapeWidth,
  level,
  result,
  graph
) => {
  let space = papersWidth - shapeWidth * level.length;
  space = Math.round(space / (level.length + 1));
  let posX = space;
  let posY = 300;
  let targetPortsArray = [];
  let xValue = space + shapeWidth / 2;
  let totalTR = 0;

  for (let i = 0; i < level.length; i++) {
    targetPortsArray.push({ x: xValue, y: 450 });
    totalTR += Math.round(level[i].TR);
    const rectangleShape = new shapes.basic.Rect({
      position: {
        x: posX,
        y: posY,
      },
      size: {
        width: 90,
        height: 60,
      },
      attrs: {
        rect: { fill: "rgb(114, 207, 52)", stroke: "rgb(114, 207, 52)" },
        text: {
          text: `C${i + 1}\n\nTR ${Math.round(level[i].TR)} `,
          fill: "#ffffff",
          fontWeight: "600",
          fontSize: "10",
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
          width: 5,
          height: 10,
          x: shapeWidth / 2 - 2,
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
          width: 5,
          height: 10,
          x: shapeWidth / 2 - 2,
          y: -25,
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
    posX = posX + space + shapeWidth;
    xValue = xValue + shapeWidth + space;
  }
  let underlineLength =
    posX - shapeWidth / 2 - space - (space + shapeWidth / 2);
  var connectPoint = underlineLength / (level.length - 1);
  var horizondalLink2 = new shapes.standard.Link();
  horizondalLink2.prop("source", {
    x: space + shapeWidth / 2,
    y: 410,
  });
  horizondalLink2.prop("target", {
    x: posX - shapeWidth / 2 - space,
    y: 410,
  });
  horizondalLink2.attr("line", { targetMarker: { type: "none" } });
  horizondalLink2.label(0, {
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
  horizondalLink2.attr("line/stroke", "black");
  horizondalLink2.addTo(graph);
  var horizondalLink1 = new shapes.standard.Link();
  horizondalLink1.prop("source", {
    x: space + shapeWidth / 2,
    y: 250,
  });
  horizondalLink1.prop("target", {
    x: posX - shapeWidth / 2 - space,
    y: 250,
  });
  horizondalLink1.attr("line", { targetMarker: { type: "none" } });
  horizondalLink1.label(0, {
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
  horizondalLink1.attr("line/stroke", "black");
  horizondalLink1.addTo(graph);
  return {
    posX: posX,
    space: space,
    targetPortsArray: targetPortsArray,
    connectPoint: connectPoint,
    horizondalLink1: horizondalLink1,
    horizondalLink2: horizondalLink2,
    underlineLength: underlineLength,
    totalTR: totalTR,
  };
};

export const verticalLine2 = (
  horizondalStarts,
  horizontalLine1,
  horizontalLine2,
  dia,
  graph,
  connectPoint
) => {
  let cells = graph.toJSON().cells;

  cells = cells.filter((item) => {
    let pos = item.position;
    if (item.type !== "standard.Link" && !item.type.includes("link")) {
      if (pos["y"] === 300) {
        return item;
      }
    }
  });
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].type !== "standard.Link" && !cells[i].type.includes("link")) {
      var horizondalLink1 = new dia.Link();
      var horizondalLink2 = new dia.Link();
      horizondalLink2.prop("source", {
        id: cells[i].id,
        magnet: "portBody",
        port: cells[i].ports.items[1].id,
      });
      horizondalLink2.prop("target", {
        id: horizontalLine2.id,
        anchor: {
          name: "connectionLength",
          args: { length: horizondalStarts },
        },
      });
      // horizondalLink1.source(cells[i].ports.items[0].id)
      horizondalLink1.prop("source", {
        id: cells[i].id,
        magnet: "portBody",
        port: cells[i].ports.items[0].id,
      });
      horizondalLink1.prop("target", {
        id: horizontalLine1.id,
        anchor: {
          name: "connectionLength",
          args: { length: horizondalStarts },
        },
      });
      horizondalStarts += Math.round(connectPoint);
      horizondalLink1.addTo(graph);
      horizondalLink2.addTo(graph);
    }
  }
};
