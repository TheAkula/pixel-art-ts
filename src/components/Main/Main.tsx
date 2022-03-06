import Board from "../Board/Board";
import ToolsBar from "../ToolsBar/ToolsBar";
import classes from "./Main.module.css";
import SettingsBar from "../SettingsBar/SettingsBar";
import ColorsPanel from "../ColorsPanel/ColorsPanel";
import Arts from "../Arts/Arts";

const Main = () => {
  return (
    <main>
      <header>
        <Arts />
      </header>
      <div className="Container">
        <div className={classes.Main}>
          <div>
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
