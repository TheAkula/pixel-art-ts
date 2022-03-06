import {
  FormEventHandler,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import classes from "./SaveImage.module.css";
import { Art, ArtsContext } from "../../../context/arts-context";
import { SettingsContext } from "../../../context/settings-context";
import { createCanvas } from "canvas";

const SaveImage = () => {
  const { settings } = useContext(SettingsContext);
  const { arts } = useContext(ArtsContext)!;
  const socket = useRef<null | WebSocket>(null);
  const [imgId, setImgId] = useState<null | string>(null);

  useEffect(() => {
    const s = new WebSocket("ws://localhost:3001");
    s.onopen = (e) => {
      console.log("connection");
    };
    s.onmessage = function (e) {
      const id = JSON.parse(e.data).id;
      setImgId(id);
      fetch("/get-img/" + id, {
        method: "GET",
      })
        .then((res) => {
          return res.blob();
        })
        .then((data) => {
          const blob = new Blob([data]);
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "download.png";
          link.click();
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    socket.current = s;
    return () => {
      if (imgId) {
        s.send(JSON.stringify({ type: "DELETE_IMG", id: imgId }));
      }
    };
  }, []);

  const onSaveImage: FormEventHandler = (e) => {
    e.preventDefault();
    const art = arts.arts.find((art) => art.id === arts.chosen)!;
    socket.current!.send(
      JSON.stringify({
        type: "CREATE_IMG",
        img: art,
        cs: settings!.columnSize,
        rs: settings!.rowSize,
        dc: settings!.defColor,
      })
    );
  };

  return (
    <form onSubmit={onSaveImage}>
      <button type="submit" className={classes.SaveImage}>
        SAVE
      </button>
      {/* <input type="hidden" name="img" value={JSON.stringify(img)} />
      <input type="hidden" name="cs" value={settings!.columnSize} />
      <input type="hidden" name="rs" value={settings!.rowSize} />
      <input type="hidden" name="dc" value={settings!.defColor} /> */}
    </form>
  );
};

export default SaveImage;
