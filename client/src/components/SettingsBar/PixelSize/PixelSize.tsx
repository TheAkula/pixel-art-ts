import { ChangeEventHandler } from "react";
import classes from "./PixelSize.module.css";

interface PixelSizeProps {
  changed: ChangeEventHandler;
  curPS: number;
}

const pixelSize = (props: PixelSizeProps) => {
  return (
    <div className={classes.PixelSize}>
      <p>PIXEL SIZE</p>
      <div>
        <input onChange={props.changed} type="text" value={props.curPS} />
      </div>
    </div>
  );
};

export default pixelSize;
