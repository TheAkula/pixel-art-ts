import classes from "./Pixel.module.css";

import { MouseEventHandler } from "react";

interface PixelProps {
  xpos: number;
  ypos: number;
  clicked: (a: number, b: number, c: string) => MouseEventHandler;
  dragStarted: MouseEventHandler;
  size: number;
  color: string;
  isDrawing: boolean;
}

const Pixel = (props: PixelProps) => {
  return (
    <div
      style={{
        background: props.color,
        width: props.size,
        height: props.size,
      }}
      onMouseEnter={
        props.isDrawing
          ? props.clicked(props.xpos, props.ypos, props.color)
          : () => {}
      }
      onMouseDown={props.dragStarted}
      onClick={props.clicked(props.xpos, props.ypos, props.color)}
      className={classes.Pixel}
    ></div>
  );
};

export default Pixel;
