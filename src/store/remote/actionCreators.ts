import { RemoteActionTypes } from './types';
import { Action } from '../Actions';

function changeImageLoading(status: boolean): RemoteActionTypes {
  return {
    type: Action.FETCHING_IMAGES_LOADING,
    payload: {
      isLoading: status
    }
  };
}

export function getImageSuccessfully(data: any):RemoteActionTypes {
  return  {
    type: Action.SUCCESSFULLY_FETCHING_IMAGES,
    payload: {
      data
    }
  }
}


export function fetchImages() {
  return async (dispatch: any) => {
    try {
      dispatch(changeImageLoading(true));
      let res = await fetch('https://jsonplaceholder.typicode.com/posts');
      res = await res.json();
      console.log(res);
    } catch (e) {
    } finally {
      dispatch(changeImageLoading(true));
    }
  };
}