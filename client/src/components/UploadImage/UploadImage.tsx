import {
  FormEventHandler,
  MouseEventHandler,
  useContext,
  useEffect,
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
  const [file, setFile] = useState<null | string>(null);
  const [imgIsValid, setImgIsValid] = useState(false);
  const [newPixelSize, setNewPixelSize] = useState(1);
  const [origSize, setOrigSize] = useState({ a: 0, b: 0 });
  const [frameSize, setFrameSize] = useState({ a: 0, b: 0 });
  const [imgData, setImgData] = useState<null | HTMLImageElement>(null);
  const fileInpRef = useRef<null | HTMLInputElement>(null);
  const imgRef = useRef<null | HTMLImageElement>(null);

  useEffect(() => {}, [imgData]);

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
    setFile(null);
  };

  const onBrowseImg = () => {
    fileInpRef.current!.click();
    setIsSelected(true);
  };

  const validateSize = (s: number) => {
    const width = imgRef.current?.offsetWidth!;
    const height = imgRef.current?.offsetHeight!;
    const frameWidth = width / s;
    const frameHeight = height / s;
    let valid = true;
    valid = valid && width % s === 0;
    valid = valid && height % s === 0;
    setFrameSize({ a: frameWidth, b: frameHeight });
    setImgIsValid(valid);
  };

  const onChosedFile = () => {
    setFile(window.URL.createObjectURL(fileInpRef.current!.files![0]));
    const img = document.createElement("img");
    img.src = window.URL.createObjectURL(fileInpRef.current!.files![0]);
  };

  const onAddPixelSize: MouseEventHandler = () => {
    setNewPixelSize((prevPixelSize) => prevPixelSize + 1);
    validateSize(newPixelSize + 1);
  };

  const onSubPixelSize: MouseEventHandler = () => {
    setNewPixelSize((prevPixelSize) => prevPixelSize - 1 || 1);
    validateSize(newPixelSize - 1 || 1);
  };

  const imgOnLoad: React.ReactEventHandler<HTMLImageElement> = (e) => {
    if (!origSize.a || !origSize.b) {
      setOrigSize({
        a: (e.target as HTMLImageElement).width,
        b: (e.target as HTMLImageElement).height,
      });
      validateSize(newPixelSize);
    }
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
            {isSelected && file ? (
              <>
                <div className={classes.ImgContainer}>
                  <img src={file} onLoad={imgOnLoad} alt="" ref={imgRef} />
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
