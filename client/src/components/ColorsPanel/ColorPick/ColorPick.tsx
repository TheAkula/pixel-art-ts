import { MouseEventHandler } from "react";

import classes from "./ColorPick.module.css";

interface ColorProps {
  color: string;
  clicked: MouseEventHandler;
  active: boolean;
}

const colorPick = (props: ColorProps) => {
  return (
    <button
      className={[classes.ColorPick, props.active ? classes.active : ""].join(
        " "
      )}
      onClick={props.clicked}
      style={{ backgroundColor: props.color }}
    ></button>
  );
};

export default colorPick;
