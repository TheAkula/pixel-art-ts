import { useCallback, useContext, useEffect, useState, useRef } from "react";

import classes from "./PreviewAnimation.module.css";
import SimplePixel from "../../SimplePixel/SimplePixel";

import { Art, ArtsContext } from "../../../context/arts-context";

interface PreviewAnimationProps {
  duration: number;
}

const PreviewAnimation = (props: PreviewAnimationProps) => {
  const [duration, setDuration] = useState(1);
  const [play, setPlay] = useState(false);
  const { arts } = useContext(ArtsContext)!;
  const [artToShow, setArtToShow] = useState<null | Art>(null);
  let timer = useRef<null | NodeJS.Timer>(null);

  const updateArtToShow = useCallback(() => {
    setArtToShow((prevArt) => {
      let index = prevArt!.id + 1;
      if (index === arts.arts.length) {
        index = 0;
      }
      const art = arts.arts.find((art) => art.id === index)!;
      return art;
    });
  }, [arts.arts]);

  useEffect(() => {
    if (!play) {
      const art = arts.arts.find((art) => art.id === arts.chosen)!;
      setArtToShow(art);
    }
  }, [arts, play]);

  useEffect(() => {
    if (play) {
      if (timer.current === null) {
        setArtToShow(arts.arts[0]);
        timer.current = setInterval(updateArtToShow, duration * 1000);
      }
    } else if (timer.current !== null) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, [play, duration, updateArtToShow, artToShow]);

  const onTogglePlayHandler = () => {
    setPlay(!play);
  };

  const ps = 6;

  return (
    <div className={classes.PreviewAnimation}>
      <button className={classes.PlayButton} onClick={onTogglePlayHandler}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      <div className={classes.PreviewAnimationSpace}>
        <div>
          {artToShow &&
            artToShow.rows.map((row) => (
              <div className={classes.Row} key={artToShow.rows.indexOf(row)}>
                {row.map((pix) => (
                  <SimplePixel
                    key={pix.ypos.toString() + pix.xpos}
                    ps={ps}
                    pix={pix}
                  />
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PreviewAnimation;
