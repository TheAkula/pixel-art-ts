interface SimplePixelProps {
  ps: number;
  pix: {
    xpos: number;
    ypos: number;
    color: string;
  };
}

const simplePixel = (props: SimplePixelProps) => (
  <div
    style={{
      width: props.ps + "px",
      height: props.ps + "px",
      backgroundColor: props.pix.color,
    }}
  ></div>
);

export default simplePixel;
