import Board from "../Board/Board";
import ToolsBar from "../ToolsBar/ToolsBar";
import classes from "./Main.module.css";
import SettingsBar from "../SettingsBar/SettingsBar";
import ColorsPanel from "../ColorsPanel/ColorsPanel";
import Arts from "../Arts/Arts";
import HistoryTriggers from "../HistoryTriggers/HistoryTriggers";
import SaveImage from "../SaveImage/SaveImage";
import UploadImage from "../UploadImage/UploadImage";

const Main = () => {
  return (
    <main>
      <div className="Container">
        <h1 style={{ color: "#bbb", fontSize: "2em", margin: "20px 0" }}>
          PIXEL ART TS
        </h1>
        <header>
          <Arts />
        </header>
      </div>
      <div className="Container">
        <div className={classes.Main}>
          <div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <SaveImage />
              <UploadImage />
            </div>
            <HistoryTriggers />
            <ToolsBar />
            <ColorsPanel />
          </div>
          <Board />
          <SettingsBar />
        </div>
      </div>
    </main>
  );
};

export default Main;
