import classes from "./ToolsBar.module.css";

import Tool from "./Tool/Tool";
import { ChangeEventHandler, useContext } from "react";
import { ArtsContext } from "../../context/arts-context";

export interface ToolProps {
  clicked: () => void;
  classes: string[];
  type: "button" | "color";
  changed?: ChangeEventHandler;
}

const ToolsBar = () => {
  const { artsState, artsDispatch } = useContext(ArtsContext)!;

  const onClickHandler = (id: string) => {
    return () => {
      artsDispatch!({
        type: "SET_TOOL",
        data: id,
      });
    };
  };

  const colorChanged: ChangeEventHandler = (e) => {
    artsDispatch({
      type: "SET_COLOR",
      data: (e.target as HTMLInputElement).value,
    });
  };

  return (
    <div className={classes.ToolsBar}>
      <Tool
        classes={[
          classes.Tool,
          classes.Brush,
          artsState.settings.tool === "BRUSH" ? classes.active : "",
        ]}
        type="color"
        clicked={onClickHandler("BRUSH")}
        changed={colorChanged}
      />
      <Tool
        classes={[
          classes.Tool,
          classes.Eraser,
          artsState.settings.tool === "ERASER" ? classes.active : "",
        ]}
        type={"button"}
        clicked={onClickHandler("ERASER")}
      />
      <Tool
        classes={[
          classes.Tool,
          classes.Fill,
          artsState.settings.tool === "FILL" ? classes.active : "",
        ]}
        type={"button"}
        clicked={onClickHandler("FILL")}
      />
      <Tool
        classes={[
          classes.Tool,
          classes.Pipette,
          artsState.settings.tool === "PIPETTE" ? classes.active : "",
        ]}
        type={"button"}
        clicked={onClickHandler("PIPETTE")}
      />
      <Tool
        classes={[
          classes.Tool,
          classes.Move,
          artsState.settings.tool === "MOVE" ? classes.active : "",
        ]}
        type={"button"}
        clicked={onClickHandler("MOVE")}
      />
    </div>
  );
};

export default ToolsBar;
