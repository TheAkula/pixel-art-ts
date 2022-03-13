import {
  ChangeEventHandler,
  MouseEventHandler,
  useContext,
  useState,
} from "react";
import { ArtsContext } from "../../context/arts-context";

import SizeToggle from "./SizeToggle/SizeToggle";
import Reset from "./Reset/Reset";
import PreviewAnimation from "./PreviewAnimation/PreviewAnimation";
import createArt from "../../hoc/createArt";
import Duration from "./Duration/Duration";
import PixelSize from "./PixelSize/PixelSize";

const SettingsBar = () => {
  const [duration, setDuration] = useState<number | string>(1);
  const { artsState, artsDispatch } = useContext(ArtsContext)!;

  const onAddRow: MouseEventHandler = (e) => {
    const row = [];
    for (let i = 0; i < artsState.settings!.columnSize; i++) {
      row.push({
        xpos: i,
        ypos: artsState.settings!.rowSize,
        color: artsState.settings!.defColor,
      });
    }
    artsDispatch({ type: "ADD_ROW", data: row });
  };

  const onDelRow: MouseEventHandler = (e) => {
    artsDispatch({ type: "DEL_ROW" });
  };

  const onAddCol: MouseEventHandler = (e) => {
    artsDispatch({
      type: "ADD_COL",
      data: {
        x: artsState.settings!.columnSize,
        color: artsState.settings!.defColor,
      },
    });
  };

  const onDelCol: MouseEventHandler = (e) => {
    artsDispatch({ type: "DEL_COL" });
  };

  const resetHandler = () => {
    const artRows = createArt(artsState.settings!);
    artsDispatch({
      type: "UPD_ART",
      artId: artsState.chosen!,
      data: { rows: artRows, id: artsState!.chosen },
    });
  };

  const durationChangedHandler: ChangeEventHandler = (e) => {
    setDuration((e.target as HTMLInputElement).value);
  };

  const pixelSizeChangedHandler: ChangeEventHandler = (e) => {
    artsDispatch({
      type: "SET_PS",
      data: +(e.target as HTMLInputElement).value,
    });
  };

  return (
    <div>
      <PreviewAnimation duration={duration} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "10px",
          margin: "10px 0",
        }}
      >
        <SizeToggle
          cur={artsState.settings!.rowSize}
          img="&#8597;"
          add={onAddRow}
          del={onDelRow}
        />
        <SizeToggle
          cur={artsState.settings!.columnSize}
          img="&#8596;"
          add={onAddCol}
          del={onDelCol}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Reset clicked={resetHandler} />
      </div>
      <Duration curDur={duration} changed={durationChangedHandler} />
      <PixelSize
        curPS={artsState.settings.pixelSize}
        changed={pixelSizeChangedHandler}
      />
    </div>
  );
};

export default SettingsBar;
