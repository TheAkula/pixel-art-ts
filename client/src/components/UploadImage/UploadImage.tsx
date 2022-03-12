import {
  FormEventHandler,
  MouseEventHandler,
  useContext,
  useRef,
  useState,
} from "react";
import axios from "axios";

import { ArtsContext } from "../../context/arts-context";
import Button from "../UI/Button/Button";
import Modal from "../UI/Modal/Modal";
import classes from "./UploadImage.module.css";
import SizeToggle from "../SettingsBar/SizeToggle/SizeToggle";

const UploadImage = () => {
  const { artsState, artsDispatch } = useContext(ArtsContext)!;
  const [showModal, setShowModal] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [haveFile, setHaveFile] = useState(false);
  const [imgIsValid, setImgIsValid] = useState(false);
  const [newPixelSize, setNewPixelSize] = useState(1);
  const [origSize, setOrigSize] = useState({ a: 0, b: 0 });
  const [frameSize, setFrameSize] = useState({ a: 0, b: 0 });
  const fileInpRef = useRef<null | HTMLInputElement>(null);
  const imgRef = useRef<null | HTMLImageElement>(null);

  const onSubmitHandler: FormEventHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    axios({
      method: "post",
      url: "/upl-img",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((data) => {
        onCloseModal();
        artsDispatch({
          type: "ADD_ART",
          data: { id: artsState.arts.length, rows: data.data },
        });
        artsDispatch({ type: "SET_PS", data: newPixelSize });
      })
      .catch((err) => {});
  };

  const onShowModal = () => {
    setShowModal(true);
  };

  const onCloseModal = () => {
    setShowModal(false);
    setIsSelected(false);
    setHaveFile(false);
  };

  const onBrowseImg = () => {
    fileInpRef.current!.click();
    setIsSelected(true);
  };

  const validateSize = () => {
    const width = imgRef.current?.offsetWidth!;
    const height = imgRef.current?.offsetHeight!;
    const frameWidth = width / newPixelSize;
    const frameHeight = height / newPixelSize;
    let valid = true;
    valid = valid && width % newPixelSize === 0;
    valid = valid && height % newPixelSize === 0;
    setFrameSize({ a: frameWidth, b: frameHeight });
    setImgIsValid(valid);
  };

  const onChosedFile = () => {
    setHaveFile(fileInpRef.current!.files!.length > 0);
  };

  const onAddPixelSize: MouseEventHandler = () => {
    setNewPixelSize((prevPixelSize) => prevPixelSize + 1);
  };

  const onSubPixelSize: MouseEventHandler = () => {
    setNewPixelSize((prevPixelSize) => prevPixelSize - 1 || 1);
  };

  const imgOnLoad = () => {
    setOrigSize({
      a: imgRef.current?.offsetWidth!,
      b: imgRef.current?.offsetHeight!,
    });
    validateSize();
  };

  return (
    <>
      <Button type="button" clicked={onShowModal}>
        LOAD
      </Button>
      {showModal && (
        <Modal closed={onCloseModal}>
          <button onClick={onBrowseImg} className={classes.BrowseButton}>
            BROWSE...
          </button>

          <form
            action="/upl-img"
            method="post"
            encType="multipart/form-data"
            onSubmit={onSubmitHandler}
          >
            <input
              onChange={onChosedFile}
              type="file"
              name="img"
              style={{ display: "none" }}
              ref={fileInpRef}
            />
            {isSelected && haveFile ? (
              <>
                <div className={classes.ImgContainer}>
                  <img
                    src={window.URL.createObjectURL(
                      fileInpRef.current!.files![0]
                    )}
                    alt=""
                    ref={imgRef}
                    onLoad={imgOnLoad}
                  />
                </div>
                <div className={classes.LoadPlace}>
                  <p style={{ textAlign: "center", marginBottom: "10px" }}>
                    Original: {origSize.a} x {origSize.b}
                  </p>
                  <p style={{ textAlign: "center", marginBottom: "10px" }}>
                    Frame Size:{" "}
                    <span style={{ color: imgIsValid ? "#000" : "red" }}>
                      {frameSize.a}
                    </span>{" "}
                    x{" "}
                    <span style={{ color: imgIsValid ? "#000" : "red" }}>
                      {frameSize.b}
                    </span>
                  </p>
                  <div className={classes.Togglers}>
                    <div className={classes.Toggler}>
                      <p>Pixel Size</p>
                      <SizeToggle
                        del={onSubPixelSize}
                        add={onAddPixelSize}
                        cur={newPixelSize}
                      />
                    </div>
                  </div>
                </div>
                <button
                  disabled={!imgIsValid}
                  type="submit"
                  className={classes.UploadButton}
                >
                  UPLOAD
                </button>
                <input type="hidden" name="ps" value={newPixelSize} />
                <input
                  type="hidden"
                  value={artsState.settings.defColor}
                  name="dc"
                />
              </>
            ) : null}
          </form>
        </Modal>
      )}
    </>
  );
};

export default UploadImage;
