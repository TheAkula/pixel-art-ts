import { MouseEventHandler, useContext } from "react";

import { SettingsContext } from "../../context/settings-context";

import classes from "./ColorsPanel.module.css";
import ColorPick from "./ColorPick/ColorPick";

const COLORS = ["red", "blue", "green", "#00008b", "#ff00ff", "white", "black"];

const ColorsPanel = () => {
  const { settingsDispatch } = useContext(SettingsContext);

  const onPickColor = (c: string) => {
    return ((e) => {
      settingsDispatch!({ type: "SET_COLOR", data: c });
    }) as MouseEventHandler;
  };

  return (
    <div className={classes.ColorsPanel}>
      {COLORS.map((color) => (
        <ColorPick key={color} color={color} clicked={onPickColor(color)} />
      ))}
    </div>
  );
};

export default ColorsPanel;
