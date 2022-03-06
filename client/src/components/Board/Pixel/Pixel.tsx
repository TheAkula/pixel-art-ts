import classes from "./Pixel.module.css";

import { DragEventHandler, MouseEventHandler } from "react";

interface PixelProps {
  xpos: number;
  ypos: number;
  clicked: (a: number, b: number, c: string) => MouseEventHandler;
  dragStarted: DragEventHandler;
  size: number;
  color: string;
}

const Pixel = (props: PixelProps) => {
  return (
    <div
      style={{
        background: props.color,
        width: props.size,
        height: props.size,
      }}
      draggable={true}
      onDragEnter={props.clicked(props.xpos, props.ypos, props.color)}
      onDragStart={props.dragStarted}
      onClick={props.clicked(props.xpos, props.ypos, props.color)}
      className={classes.Pixel}
    ></div>
  );
};

export default Pixel;
