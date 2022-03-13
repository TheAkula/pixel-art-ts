import { ChangeEventHandler } from "react";
import classes from "./Duration.module.css";

interface DurationProps {
  changed: ChangeEventHandler;
  curDur: number | string;
}

const duration = (props: DurationProps) => {
  return (
    <div className={classes.Duration}>
      <p>DURATION</p>
      <div>
        <input onChange={props.changed} type="text" value={props.curDur} />
      </div>
    </div>
  );
};

export default duration;
