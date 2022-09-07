import React from "react";
import "./LoadMoreImagesPopup.scss";
import { AppState } from "../../../store";
import { connect } from "react-redux";
import {
  addImageData,
  updateActiveImageIndex,
  updateActiveLabelType,
} from "../../../store/labels/actionCreators";
import { GenericYesNoPopup } from "../GenericYesNoPopup/GenericYesNoPopup";
import { useDropzone } from "react-dropzone";
import { ImageData } from "../../../store/labels/types";
import { PopupActions } from "../../../logic/actions/PopupActions";
import { ImageDataUtil } from "../../../utils/ImageDataUtil";
import { LabelType } from "../../../data/enums/LabelType";

interface IProps {
  addImageData: (imageData: ImageData[]) => any;
  updateActiveImageIndex: (number) => any;
  activeImageIndex: number | null;
  updateActiveLabelType: (labelType: LabelType) => any;
}

const LoadMoreImagesPopup: React.FC<IProps> = ({
  addImageData,
  activeImageIndex,
  updateActiveImageIndex,
  updateActiveLabelType,
}) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png"],
    },
  });

  const onAccept = () => {
    if (acceptedFiles.length > 0) {
      addImageData(
        acceptedFiles.map((fileData: File) =>
          ImageDataUtil.createImageDataFromFileData(fileData)
        )
      );
      if (activeImageIndex === null) {
        updateActiveImageIndex(0);
      }
      PopupActions.close();
    }
  };

  const onReject = () => {
    PopupActions.close();
  };

  const getDropZoneContent = () => {
    if (acceptedFiles.length === 0)
      return (
        <>
          <input {...getInputProps()} />
          <img draggable={false} alt={"upload"} src={"ico/box-opened.png"} />
          <p className="extraBold">Add new images</p>
          <p>or</p>
          <p className="extraBold">Click here to select them</p>
        </>
      );
    else if (acceptedFiles.length === 1)
      return (
        <>
          <img draggable={false} alt={"uploaded"} src={"ico/box-closed.png"} />
          <p className="extraBold">1 new image loaded</p>
        </>
      );
    else
      return (
        <>
          <img
            draggable={false}
            key={1}
            alt={"uploaded"}
            src={"ico/box-closed.png"}
          />
          <p key={2} className="extraBold">
            {acceptedFiles.length} new images loaded
          </p>
        </>
      );
  };

  const renderContent = () => {
    return (
      <div className="LoadMoreImagesPopupContent">
        <div {...getRootProps({ className: "DropZone" })}>
          {getDropZoneContent()}
        </div>
      </div>
    );
  };

  return (
    <GenericYesNoPopup
      title={"Load more images"}
      renderContent={renderContent}
      acceptLabel={"Load"}
      disableAcceptButton={acceptedFiles.length < 1}
      onAccept={onAccept}
      rejectLabel={"Cancel"}
      onReject={onReject}
    />
  );
};

const mapDispatchToProps = {
  addImageData,
  updateActiveImageIndex,
  updateActiveLabelType,
};

const mapStateToProps = (state: AppState) => ({
  activeImageIndex: state.labels.activeImageIndex,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadMoreImagesPopup);
