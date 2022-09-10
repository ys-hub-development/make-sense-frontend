import { Action } from '../Actions';

export type RemoteState = {
  images: any[]
  loading: boolean
};

interface FetchImageSuccess {
  type: typeof Action.SUCCESSFULLY_FETCHING_IMAGES;
  payload: {
    data: [];
  };
}

interface FetchingImageLoading {
  type: typeof Action.FETCHING_IMAGES_LOADING;
  payload: {
    isLoading: boolean
  };
}

export type RemoteActionTypes =
  | FetchImageSuccess
  | FetchingImageLoading

