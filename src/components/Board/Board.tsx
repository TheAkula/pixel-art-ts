import classes from "./Board.module.css";
import createArt from "../../hoc/createArt";

import { SettingsContext } from "../../context/settings-context";
import { ArtsContext } from "../../context/arts-context";
import {
  DragEventHandler,
  MouseEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Art } from "../../context/arts-context";

import Pixel from "./Pixel/Pixel";

const Board = () => {
  const { settings, settingsDispatch } = useContext(SettingsContext);
  const { arts, artsDispatch } = useContext(ArtsContext)!;
  const [draggedPixels, setDraggedPixels] = useState<null | {
    x: number;
    y: number;
  }>(null);
  const boardRef = useRef(null);

  useEffect(() => {
    if (arts.chosen === null) {
      const rows = createArt(settings!);
      artsDispatch({
        type: "ADD_ART",
        data: {
          rows: rows,
          id: arts.arts.length,
        },
      });
    }
  }, [artsDispatch, settings, arts]);

  const onDragEnd: EventListener = (e) => {
    e.preventDefault();
    setDraggedPixels(null);
    document.removeEventListener("dragend", onDragEnd);
  };

  const onDragStart: DragEventHandler = (e) => {
    const clone = (e.target as HTMLElement).cloneNode(true);
    (clone as HTMLElement).style.display = "none";
    e.dataTransfer.setDragImage(clone as Element, 0, 0);
    document.addEventListener("dragend", onDragEnd);
  };

  const pixelClickedHandler = (xpos: number, ypos: number, color: string) => {
    return ((e) => {
      e.preventDefault();

      switch (settings!.tool) {
        case "BRUSH":
          artsDispatch({
            type: "SET_PIX",
            artId: arts.chosen!,
            data: settings!.color,
            x: xpos,
            y: ypos,
          });
          break;
        case "ERASER":
          artsDispatch({
            type: "SET_PIX",
            artId: arts.chosen!,
            data: settings!.defColor,
            x: xpos,
            y: ypos,
          });
          break;
        case "FILL":
          const art: Art = JSON.parse(
            JSON.stringify(arts.arts.find((art) => art.id === arts.chosen))
          );
          const fillPix = (x: number, y: number) => {
            const checkPix = (xp: number, yp: number): boolean => {
              if (
                yp > art.rows.length - 1 ||
                yp < 0 ||
                xp > art.rows[yp].length ||
                xp < 0
              )
                return false;
              const pix = art.rows[yp][xp];
              if (!pix) return false;
              const colorP = pix.color;
              return colorP !== settings!.color && colorP === color;
            };
            art.rows[y][x].color = settings!.color;

            if (checkPix(x + 1, y)) {
              fillPix(x + 1, y);
            }
            if (checkPix(x, y + 1)) {
              fillPix(x, y + 1);
            }
            if (checkPix(x, y - 1)) {
              fillPix(x, y - 1);
            }
            if (checkPix(x - 1, y)) {
              fillPix(x - 1, y);
            }
          };
          fillPix(xpos, ypos);
          artsDispatch({ type: "UPD_ART", artId: arts.chosen!, data: art });
          break;
        case "PIPETTE":
          settingsDispatch!({ type: "SET_COLOR", data: color });
          break;
        case "MOVE":
          let dragPix = draggedPixels;
          if (!dragPix) {
            setDraggedPixels({ x: xpos, y: ypos });
            dragPix = { x: xpos, y: ypos };
          }
          let x = xpos - dragPix!.x;
          let y = ypos - dragPix!.y;
          if (x > 0) {
            x = Math.floor(x / 2);
          } else {
            x = Math.ceil(x / 2);
          }
          if (y > 0) {
            y = Math.floor(y / 2);
          } else {
            y = Math.ceil(y / 2);
          }

          if (Math.abs(x) === 1) {
            setDraggedPixels({ x: xpos, y: draggedPixels!.y });
          }
          if (Math.abs(y) === 1) {
            setDraggedPixels({ x: draggedPixels!.x, y: ypos });
          }
          const newArt = JSON.parse(
            JSON.stringify(arts.arts.find((art) => art.id === arts.chosen))
          ) as Art;
          newArt.rows.forEach((row, ind) => {
            row.forEach((pix) => {
              const newX = pix.xpos + x;
              const newY = pix.ypos + y;
              pix.xpos =
                newX > row.length - 1
                  ? newX - row.length
                  : newX < 0
                  ? row.length + newX
                  : newX;
              pix.ypos =
                newY > newArt.rows.length - 1
                  ? newY - newArt.rows.length
                  : newY < 0
                  ? newArt.rows.length + newY
                  : newY;
            });
            if (x > 0) {
              newArt.rows[ind] = row
                .slice(row.length - x)
                .concat(row.slice(0, row.length - x));
            } else {
              newArt.rows[ind] = row
                .slice(Math.abs(x))
                .concat(row.slice(0, Math.abs(x)));
            }
          });
          if (y > 0) {
            newArt.rows = newArt.rows
              .slice(newArt.rows.length - y)
              .concat(newArt.rows.slice(0, newArt.rows.length - y));
          } else {
            newArt.rows = newArt.rows
              .slice(Math.abs(y))
              .concat(newArt.rows.slice(0, Math.abs(y)));
          }
          artsDispatch({
            type: "UPD_ART",
            data: newArt,
            artId: arts.chosen!,
          });
          break;
        default:
          return;
      }
    }) as MouseEventHandler<HTMLDivElement>;
  };

  let art: null | Art = null;

  if (arts.arts.length) {
    art = arts.arts!.find((art) => art.id === arts.chosen)!;
  }

  const ps = 600 / settings!.columnSize;
  return (
    <div ref={boardRef} className={classes.Board}>
      {art &&
        art.rows.map((arr) => {
          return arr.map((pixel) => (
            <Pixel
              size={ps}
              clicked={pixelClickedHandler}
              dragStarted={onDragStart}
              key={pixel.ypos.toString() + pixel.xpos}
              {...pixel}
            />
          ));
        })}
    </div>
  );
};

export default Board;
