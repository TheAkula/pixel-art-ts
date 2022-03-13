import { useCallback, useContext, useEffect, useState, useRef } from "react";

import classes from "./PreviewAnimation.module.css";
import SimplePixel from "../../SimplePixel/SimplePixel";

import { Art, ArtsContext } from "../../../context/arts-context";

interface PreviewAnimationProps {
  duration: number | string;
}

const PreviewAnimation = (props: PreviewAnimationProps) => {
  const [play, setPlay] = useState(false);
  const { artsState } = useContext(ArtsContext)!;
  const [artToShow, setArtToShow] = useState<null | Art>(null);
  let timer = useRef<null | NodeJS.Timer>(null);

  const updateArtToShow = useCallback(() => {
    setArtToShow((prevArt) => {
      let index = prevArt!.id + 1;
      if (index === artsState.arts.length) {
        index = 0;
      }
      const art = artsState.arts.find((art) => art.id === index)!;
      return art;
    });
  }, [artsState.arts]);

  useEffect(() => {
    if (!play) {
      const art = artsState.arts.find((art) => art.id === artsState.chosen)!;
      setArtToShow(art);
    }
  }, [artsState, play]);

  useEffect(() => {
    if (play) {
      if (timer.current === null) {
        if (!isNaN(+props.duration)) {
          setArtToShow(artsState.arts[0]);
          timer.current = setInterval(updateArtToShow, +props.duration * 1000);
        }
      }
    } else if (timer.current !== null) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, [play, props.duration, updateArtToShow, artToShow, artsState.arts]);

  const onTogglePlayHandler = () => {
    setPlay(!play);
  };

  const ps = 6;

  return (
    <div className={classes.PreviewAnimation}>
      <button className={classes.PlayButton} onClick={onTogglePlayHandler}>
        {!play ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#313131"
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
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="transparent"
            stroke="rgb(224, 34, 34)"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )}
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
                    pix={{
                      ...pix,
                      color:
                        pix.color === artsState.settings.defColor
                          ? "transparent"
                          : pix.color,
                    }}
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
