export const totalBox = (shapes, space, shapeWidth, underlineLength, yAxis) => {
  const ConnectionRectangle = new shapes.basic.Rect({
    position: {
      x: space + shapeWidth / 2 + (underlineLength / 2 - 30),
      y: yAxis,
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
  return ConnectionRectangle;
};
