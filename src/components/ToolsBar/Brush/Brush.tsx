import { ToolProps } from "../ToolsBar";

const Tool = (props: ToolProps) => {
  return (
    <button
      className={props.classes.join(" ")}
      onClick={props.clicked}
    ></button>
  );
};

export default Tool;
