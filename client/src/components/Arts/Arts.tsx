import { MouseEventHandler, useContext } from "react";

import classes from "./Arts.module.css";
import artClasses from "./Art/Art.module.css";
import Art from "./Art/Art";

import { ArtsContext } from "../../context/arts-context";

import createArt from "../../hoc/createArt";

const Arts = () => {
  const { artsState, artsDispatch } = useContext(ArtsContext)!;

  const artClickedHandler = (id: number) => {
    return ((e) => {
      const target = e.target as HTMLElement;
      if (target.closest("." + artClasses.Art) && !target.closest("button")) {
        artsDispatch({ type: "SET_CHOSEN", data: id });
      }
    }) as MouseEventHandler;
  };

  const onAddedArt = () => {
    const rows = createArt(artsState.settings!);
    artsDispatch({
      type: "ADD_ART",
      data: {
        rows: rows,
        id: artsState.arts.length,
      },
    });
  };

  const onDeleteArt = (id: number) => () => {
    artsDispatch({ type: "DELETE_ART", data: id });
  };

  const onCopyArt = (id: number) => () => {
    artsDispatch({ type: "COPY_ART", data: id });
  };

  return (
    <div className={classes.Arts}>
      <button className={classes.AddButton} onClick={onAddedArt}>
        +
      </button>
      <div className={classes.Wrapper}>
        {artsState.arts.map((art) => (
          <Art
            isChosen={artsState.chosen === art.id}
            onCopyArt={onCopyArt(art.id)}
            onDeleteArt={onDeleteArt(art.id)}
            key={art.id}
            {...art}
            clicked={artClickedHandler(art.id)}
            defColor={artsState.settings.defColor}
          />
        ))}
      </div>
    </div>
  );
};

export default Arts;
