import classes from "./Modal.module.css";

const modal = (props: any) => {
  return (
    <>
      <div className={classes.Background} onClick={props.closed}></div>
      <div className={classes.Modal}>
        <div className={classes.ModalHead}>
          <button onClick={props.closed} className={classes.CloseButton}>
            X
          </button>
        </div>
        <div className={classes.ModalContent}>{props.children}</div>
      </div>
    </>
  );
};

export default modal;
