import { MouseEventHandler } from "react";

import classes from "./SizeToggle.module.css";

interface SizeToggleProps {
  add: MouseEventHandler;
  del: MouseEventHandler;
  img?: string;
  cur: number;
}

const sizeToggle = (props: SizeToggleProps) => {
  return (
    <div className={classes.SizeToggle}>
      {props.img && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "60px",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <p className={classes.SizeToggleImg}>{props.img}</p>
        </div>
      )}
      <div className={classes.SizeCurrent}>
        <p>{props.cur}</p>
      </div>
      <div className={classes.BtnBlock}>
        <button type="button" className={classes.Btn} onClick={props.add}>
          +
        </button>
        <button type="button" className={classes.Btn} onClick={props.del}>
          -
        </button>
      </div>
    </div>
  );
};

export default sizeToggle;
