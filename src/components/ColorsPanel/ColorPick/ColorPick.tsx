import { MouseEventHandler } from "react";

import classes from "./ColorPick.module.css";

interface ColorProps {
  color: string;
  clicked: MouseEventHandler;
}

const colorPick = (props: ColorProps) => {
  return (
    <button
      className={classes.ColorPick}
      onClick={props.clicked}
      style={{ backgroundColor: props.color }}
    ></button>
  );
};

export default colorPick;
