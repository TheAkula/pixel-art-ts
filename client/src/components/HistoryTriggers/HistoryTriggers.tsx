import { useContext } from "react";
import { ArtsContext } from "../../context/arts-context";
import HistoryTrigger from "./HistoryTrigger/HistoryTrigger";
import classes from "./HistoryTriggers.module.css";

const HistoryTriggers = () => {
  const { artsDispatch } = useContext(ArtsContext)!;
  const prev = () => {
    artsDispatch({ type: "BACK_HIS" });
  };

  const next = () => {
    artsDispatch({ type: "NEXT_HIS" });
  };

  return (
    <div className={classes.HistoryTriggers}>
      <HistoryTrigger func={prev}>
        <img src="https://www.svgrepo.com/show/342966/backward.svg" alt="" />
      </HistoryTrigger>
      <HistoryTrigger func={next} style={{ transform: "scaleX(-1)" }}>
        <img src="https://www.svgrepo.com/show/342966/backward.svg" alt="" />
      </HistoryTrigger>
    </div>
  );
};

export default HistoryTriggers;
