import { MouseEventHandler, useContext } from "react";

import classes from "./ColorsPanel.module.css";
import ColorPick from "./ColorPick/ColorPick";

import { ArtsContext } from "../../context/arts-context";

const COLORS = ["red", "blue", "green", "#00008b", "#ff00ff", "white", "black"];

const ColorsPanel = () => {
  const { artsState, artsDispatch } = useContext(ArtsContext)!;

  const onPickColor = (c: string) => {
    return ((e) => {
      artsDispatch!({ type: "SET_COLOR", data: c });
    }) as MouseEventHandler;
  };

  return (
    <div className={classes.ColorsPanel}>
      {COLORS.map((color) => (
        <ColorPick
          active={artsState.settings.color === color}
          key={color}
          color={color}
          clicked={onPickColor(color)}
        />
      ))}
    </div>
  );
};

export default ColorsPanel;
