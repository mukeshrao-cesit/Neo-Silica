export const totalBox = (
  shapes,
  space,
  shapeWidth,
  underlineLength,
  yAxis,
  totalTR
) => {
  const ConnectionRectangle = new shapes.basic.Rect({
    position: {
      x: space + shapeWidth / 2 + underlineLength / 2 - 60,
      y: yAxis,
    },
    size: {
      width: 120,
      height: 30,
    },
    attrs: {
      text: {
        text: `Total : ${totalTR} `,
        fontWeight: "600",
        fontSize: "16",
      },
    },
  });
  return ConnectionRectangle;
};
