import { ToolProps } from "../ToolsBar";

const Tool = (props: ToolProps) => {
  return (
    <input
      type={props.type}
      className={props.classes.join(" ")}
      onClick={props.clicked}
      onChange={!!props.changed ? props.changed : undefined}
    />
  );
};

export default Tool;
