import { MouseEventHandler } from "react";
import classes from "./Reset.module.css";

interface ResetProps {
  clicked: MouseEventHandler;
}

const reset = (props: ResetProps) => {
  return (
    <div className={classes.Reset}>
      <button onClick={props.clicked}>RESET</button>
    </div>
  );
};

export default reset;
