import classes from "./HistoryTrigger.module.css";

interface HistoryTriggerProps {
  func: () => void;
  children?: any;
  style?: {};
}

const historyTrigger = (props: HistoryTriggerProps) => (
  <button
    style={props.style}
    className={classes.HistoryTrigger}
    onClick={props.func}
  >
    {props.children}
  </button>
);

export default historyTrigger;
