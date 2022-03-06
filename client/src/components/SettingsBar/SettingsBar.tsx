import { MouseEventHandler, useContext, useState } from "react";
import { SettingsContext } from "../../context/settings-context";
import { ArtsContext } from "../../context/arts-context";

import SizeToggle from "./SizeToggle/SizeToggle";
import Reset from "./Reset/Reset";
import PreviewAnimation from "./PreviewAnimation/PreviewAnimation";
import createArt from "../../hoc/createArt";

const SettingsBar = () => {
  const [duration, setDuration] = useState(1);
  const { settings, settingsDispatch } = useContext(SettingsContext);
  const { arts, artsDispatch } = useContext(ArtsContext)!;

  const onAddRow: MouseEventHandler = (e) => {
    settingsDispatch!({ type: "ADD_ROW" });
    const row = [];
    for (let i = 0; i < settings!.columnSize; i++) {
      row.push({
        xpos: i,
        ypos: settings!.rowSize,
        color: settings!.defColor,
      });
    }
    artsDispatch({ type: "ADD_ROW", data: row });
  };

  const onDelRow: MouseEventHandler = (e) => {
    settingsDispatch!({ type: "DEL_ROW" });
    artsDispatch({ type: "DEL_ROW" });
  };

  const onAddCol: MouseEventHandler = (e) => {
    settingsDispatch!({ type: "ADD_COL" });
    artsDispatch({
      type: "ADD_COL",
      data: { x: settings!.columnSize, color: settings!.defColor },
    });
  };

  const onDelCol: MouseEventHandler = (e) => {
    settingsDispatch!({ type: "DEL_COL" });
    artsDispatch({ type: "DEL_COL" });
  };

  const resetHandler: MouseEventHandler = (e) => {
    const artRows = createArt(settings!);
    artsDispatch({
      type: "UPD_ART",
      artId: arts.chosen!,
      data: { rows: artRows, id: arts!.chosen },
    });
  };

  return (
    <div>
      <PreviewAnimation duration={0} />
      <SizeToggle
        cur={settings!.rowSize}
        img="&#8597;"
        add={onAddRow}
        del={onDelRow}
      />
      <SizeToggle
        cur={settings!.columnSize}
        img="&#8596;"
        add={onAddCol}
        del={onDelCol}
      />
      <Reset clicked={resetHandler} />
    </div>
  );
};

export default SettingsBar;
