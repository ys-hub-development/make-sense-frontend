import { RemoteActionTypes, RemoteState } from './types';
import { Action } from '../Actions';

const initialState: RemoteState = {
  images: [],
  loading: false
};

export function remoteReducer(
  state = initialState,
  action: RemoteActionTypes
): RemoteState {
  switch (action.type) {
    case Action.FETCHING_IMAGES_LOADING:
      return  {
        ...state,
        loading: action.payload.isLoading
      }
    case Action.SUCCESSFULLY_FETCHING_IMAGES:
      return  {
        ...state,
        images: action.payload.data
      }
    default:
      return state;
  }
}
