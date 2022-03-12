import classes from "./Button.module.css";

interface ButtonProps {
  type: "button" | "submit" | "reset";
  children?: string | React.ReactChildren;
  clicked?: () => void;
}

const button = (props: ButtonProps) => (
  <button
    onClick={props.clicked || function () {}}
    type={props.type}
    className={classes.Button}
  >
    {props.children}
  </button>
);

export default button;
