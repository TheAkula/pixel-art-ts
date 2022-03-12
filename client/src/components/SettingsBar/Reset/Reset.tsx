import classes from "./Reset.module.css";
import Button from "../../UI/Button/Button";

interface ResetProps {
  clicked: () => void;
}

const reset = (props: ResetProps) => {
  return (
    <div className={classes.Reset}>
      <Button clicked={props.clicked} type="button">
        RESET
      </Button>
    </div>
  );
};

export default reset;
