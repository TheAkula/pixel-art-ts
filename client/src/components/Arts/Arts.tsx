import { MouseEventHandler, useContext } from "react";

import classes from "./Arts.module.css";
import artClasses from "./Art/Art.module.css";
import Art from "./Art/Art";

import { ArtsContext } from "../../context/arts-context";
import { SettingsContext } from "../../context/settings-context";

import createArt from "../../hoc/createArt";

interface ArtsProps {}

const Arts = (props: ArtsProps) => {
  const { arts, artsDispatch } = useContext(ArtsContext)!;
  const { settings } = useContext(SettingsContext);

  const artClickedHandler = (id: number) => {
    return ((e) => {
      if ((e.target as HTMLElement).classList.contains(artClasses.Art))
        artsDispatch({ type: "SET_CHOSEN", data: id });
    }) as MouseEventHandler;
  };

  const onAddedArt = () => {
    const rows = createArt(settings!);
    artsDispatch({
      type: "ADD_ART",
      data: {
        rows: rows,
        id: arts.arts.length,
      },
    });
  };

  const onDeleteArt = (id: number) => () => {
    artsDispatch({ type: "DELETE_ART", data: id });
  };

  const onCopyArt = (id: number) => () => {
    // const copiedArt = arts.arts.find(art => art.id === id);
    artsDispatch({ type: "COPY_ART", data: id });
  };

  return (
    <div className={classes.Arts}>
      <button className={classes.AddButton} onClick={onAddedArt}>
        +
      </button>
      <div className={classes.Wrapper}>
        {arts.arts.map((art) => (
          <Art
            isChosen={arts.chosen === art.id}
            onCopyArt={onCopyArt(art.id)}
            onDeleteArt={onDeleteArt(art.id)}
            key={art.id}
            {...art}
            clicked={artClickedHandler(art.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Arts;
