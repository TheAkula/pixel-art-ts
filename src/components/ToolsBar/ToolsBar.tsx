import classes from "./ToolsBar.module.css";

import Tool from "./Brush/Brush";
import { MouseEventHandler, useContext } from "react";

import { SettingsContext } from "../../context/settings-context";
import SaveImage from "./SaveImage/SaveImage";

export interface ToolProps {
  clicked: MouseEventHandler<HTMLButtonElement>;
  classes: string[];
}

const ToolsBar = () => {
  const { settings, settingsDispatch } = useContext(SettingsContext);

  const onClickHandler = (id: string) => {
    return ((e) => {
      settingsDispatch!({
        type: "SET_TOOL",
        data: settings!.tool === id ? null : id,
      });
    }) as MouseEventHandler<HTMLButtonElement>;
  };

  return (
    <div className={classes.ToolsBar}>
      <Tool
        classes={[
          classes.Tool,
          classes.Brush,
          settings!.tool === "BRUSH" ? classes.active : "",
        ]}
        clicked={onClickHandler("BRUSH")}
      />
      <Tool
        classes={[
          classes.Tool,
          classes.Eraser,
          settings!.tool === "ERASER" ? classes.active : "",
        ]}
        clicked={onClickHandler("ERASER")}
      />
      <Tool
        classes={[
          classes.Tool,
          classes.Fill,
          settings!.tool === "FILL" ? classes.active : "",
        ]}
        clicked={onClickHandler("FILL")}
      />
      <Tool
        classes={[
          classes.Tool,
          classes.Pipette,
          settings!.tool === "PIPETTE" ? classes.active : "",
        ]}
        clicked={onClickHandler("PIPETTE")}
      />
      <Tool
        classes={[
          classes.Tool,
          classes.Move,
          settings!.tool === "MOVE" ? classes.active : "",
        ]}
        clicked={onClickHandler("MOVE")}
      />
      <SaveImage />
    </div>
  );
};

export default ToolsBar;
