import classes from "./Art.module.css";
import SimplePixel from "../../SimplePixel/SimplePixel";

import { Art as ArtType } from "../../../context/arts-context";
import { MouseEventHandler } from "react";

type ArtProps = {
  clicked: MouseEventHandler;
  onDeleteArt: () => void;
  onCopyArt: () => void;
  isChosen: boolean;
} & ArtType;

const art = (props: ArtProps) => {
  const ps = 80 / (16 * 2);

  return (
    <div
      className={classes.Art}
      onClick={props.clicked}
      style={{ border: props.isChosen ? "1px solid red" : "none" }}
    >
      <button
        onClick={props.onDeleteArt}
        className={[classes.Button, classes.DeleteButton].join(" ")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
      <button
        onClick={props.onCopyArt}
        className={[classes.Button, classes.CopyButton].join(" ")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
          />
        </svg>
      </button>
      {props.rows.map((row) => (
        <div className={classes.Row} key={props.rows.indexOf(row)}>
          {row.map((pix) => (
            <SimplePixel
              key={pix.ypos.toString() + pix.xpos}
              ps={ps}
              pix={pix}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default art;
