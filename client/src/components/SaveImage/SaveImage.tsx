import {
  FormEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import classes from "./SaveImage.module.css";
import { ArtsContext } from "../../context/arts-context";
import Modal from "../UI/Modal/Modal";
import Button from "../UI/Button/Button";

const SaveImage = () => {
  const { artsState } = useContext(ArtsContext)!;
  const socket = useRef<null | WebSocket>(null);
  const [showModal, setShowModal] = useState(false);
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    const s = new WebSocket("ws://pixel-art-ts.herokuapp.com/");
    s.onopen = (e) => {};
    s.onmessage = function (e) {
      const id = JSON.parse(e.data).id;
      fetch("/get-img/" + id, {
        method: "GET",
      })
        .then((res) => {
          return res.blob();
        })
        .then((data) => {
          setShowModal(true);
          const blob = new Blob([data]);
          const url = window.URL.createObjectURL(blob);
          setImgUrl(url);
        })
        .catch((err) => {});
    };
    socket.current = s;
  }, []);

  const onSaveImage: FormEventHandler = (e) => {
    e.preventDefault();
    const art = artsState.arts.find((art) => art.id === artsState.chosen)!;
    socket.current!.send(
      JSON.stringify({
        type: "CREATE_IMG",
        img: art,
        ps: artsState.settings.pixelSize,
        cs: artsState.settings.columnSize,
        rs: artsState.settings.rowSize,
        dc: artsState.settings.defColor,
      })
    );
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  const onDownloadImg = () => {
    const link = document.createElement("a");
    link.download = "download.png";
    link.href = imgUrl;
    link.click();
  };

  const chosenArt = artsState.arts.find((art) => art.id === artsState.chosen)!;

  let modal;
  if (showModal) {
    modal = (
      <Modal closed={onCloseModal}>
        <h2 style={{ textAlign: "center" }}>PREVIEW</h2>
        <div className={classes.ImgContainer}>
          {chosenArt.rows.map((row, i) => (
            <div className={classes.ArtRow} key={i}>
              {row.map((pix) => (
                <div
                  key={pix.ypos.toString() + pix.xpos}
                  style={{
                    backgroundColor: pix.color,
                    width: "10px",
                    height: "10px",
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
        <button className={classes.DownloadButton} onClick={onDownloadImg}>
          DOWNLOAD
        </button>
      </Modal>
    );
  }

  return (
    <form onSubmit={onSaveImage}>
      <Button type="submit">DOWNLOAD</Button>
      {showModal && modal}
    </form>
  );
};

export default SaveImage;
