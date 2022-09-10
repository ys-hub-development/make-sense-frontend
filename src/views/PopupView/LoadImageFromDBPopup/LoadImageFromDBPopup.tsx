import { GenericYesNoPopup } from '../GenericYesNoPopup/GenericYesNoPopup';
import React, { useCallback, useState } from 'react';
import { PopupActions } from '../../../logic/actions/PopupActions';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { ImageData } from '../../../store/labels/types';
import { addImageData } from '../../../store/labels/actionCreators';
import { ImageDataUtil } from '../../../utils/ImageDataUtil';
import { ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import './LoadImageFromDBPopup.scss';

const imgUrls = [
  'https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/327131/pexels-photo-327131.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/1620653/pexels-photo-1620653.jpeg?auto=compress&cs=tinysrgb&w=1600'
];

async function getFileFromUrl(url, name, defaultType = 'image/jpeg') {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: data.type || defaultType
  });
}

interface IProps {
  addImage: (data: ImageData[]) => void;
  getImages: () => void;
}

const LoadImageFromDB = ({ addImage }: IProps) => {
  const [selected, setSelected] = useState<ImageData[]>([]);

  const renderContent = useCallback(() => {
    return (
      <div className='LoadImageFromDB'>
        <ImageList cols={4} gap={20}>
          {imgUrls.map((item, idx) => (
            <ImageListItem key={item}>
              <img
                src={`${item}?w=248&fit=crop&auto=format`}
                srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
                alt={`example-${idx}`}
                loading='lazy'
              />
              <ImageListItemBar
                title={`example-${idx}`}
                position='below'
              />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
    );
  }, []);
  const getImages = useCallback(async () => {
    const tmp: File[] = [];
    try {
      for (let i = 0; i < imgUrls.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const res = await getFileFromUrl(imgUrls[i], `example-${i + 1}`);
        tmp.push(res);
      }

      addImage(
        tmp.map((fileData: File) =>
          ImageDataUtil.createImageDataFromFileData(fileData)
        )
      );
      PopupActions.close();
    } catch (e) {

    }
  }, []);

  const onAccept = useCallback(() => {
    getImages();
  }, [getImages]);

  const onReject = useCallback(() => {
    PopupActions.close();
  }, []);


  return (
    <GenericYesNoPopup
      title={'Load more images'}
      renderContent={renderContent}
      acceptLabel={'Load'}
      disableAcceptButton={false}
      onAccept={onAccept}
      rejectLabel={'Cancel'}
      onReject={onReject}
      popupClassName='large'
    />
  );
};

const mapDispatchToProps = {
  addImage: addImageData
};

const mapStateToProps = (state: AppState) => ({});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(LoadImageFromDB);
