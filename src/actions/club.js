import axios from 'axios';
import {
  CLUB_GOT_LIST,
  CLUB_CREATED,
  CLUB_UPDATED,
  CLUB_DELETED,
  CLUB_ERROR,
  CLUB_CHANGE_SEARCH_FIELD,
  CLUB_CHANGE_VIEW_MODE,
  CLUB_SELECT_CLUB,
  CLUB_SELECT_CLUB_MEMBER,
  CLUB_SELECT_CLUB_EVENT,
} from './types';
import { MAPOHOLIC_SERVER } from '../config';

// *** Local Actions ***
// change club view mode
export const setClubViewModeAction = (mode) => {
  const validModes = ['none', 'view', 'add', 'edit', 'delete'];
  if (validModes.includes(mode)) {
    return ({
      type: CLUB_CHANGE_VIEW_MODE,
      payload: mode,
    });
  }
  return null;
};
// track changes to the club search field
export const setClubSearchFieldAction = (text) => ({
  type: CLUB_CHANGE_SEARCH_FIELD,
  payload: text,
});
// select a club to show further information
export const selectClubToDisplayAction = (clubId) => ({
  type: CLUB_SELECT_CLUB,
  payload: clubId,
});
// select a club member to show further information (user profile + maps)
export const selectClubMemberAction = (userId) => ({
  type: CLUB_SELECT_CLUB_MEMBER,
  payload: userId,
});
// select a club's event to show further information (event details + maps)
export const selectClubEventAction = (eventId) => ({
  type: CLUB_SELECT_CLUB_EVENT,
  payload: eventId,
});
// cancel a displayed error message
export const cancelClubErrorAction = () => ({
  type: CLUB_ERROR,
  payload: '',
});

// *** actions that are functions are enabled by redux-thunk middleware ***

// *** Helper functions ***
// handle errors consistently, for all routes except login
const handleError = (errorType) => (err, dispatch) => {
  if (err.response) { // received response with an error status code
    if (err.response.data.error) { // expected error message from API
      dispatch({ type: errorType, payload: err.response.data.error });
    } else {
      dispatch({ type: errorType, payload: err.response.data });
    }
  } else if (err.request) { // request made but no response received
    dispatch({ type: errorType, payload: 'No response from server.' });
  } else { // error prior to sending request
    dispatch({ type: errorType, payload: err.message });
  }
};
// convert a (shallow) object to a query string
const toQueryString = (obj) => {
  return '?'.concat(Object.keys(obj).map((key) => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
  }).join('&'));
};

// *** API functions ***
// retrieve a list of all clubs (ids) matching specified criteria
// app.get('/clubs', publicRoute, Clubs.getClubList);
export const getClubListAction = (searchCriteria, callback) => async (dispatch) => {
  try {
    const queryString = (searchCriteria) ? toQueryString(searchCriteria) : '';
    const response = await axios.get(`${MAPOHOLIC_SERVER}/clubs${queryString}`);
    dispatch({ type: CLUB_GOT_LIST, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(CLUB_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// create a club
// autopopulate Czech clubs from abbreviation
// app.post('/clubs', requireAuth, Clubs.createClub);
export const createClubAction = (formValues, callback) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { auth } = state;
    const token = auth.authenticated;
    const response = await axios.post(`${MAPOHOLIC_SERVER}/clubs`, formValues, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: CLUB_CREATED, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(CLUB_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// update the specified club (multiple amendment not supported)
// try to populate ORIS if abbreviation changes and looks Czech
// app.patch('/clubs/:id', requireAuth, Clubs.updateClub);
export const updateClubAction = (clubId, formValues, callback) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { auth } = state;
    const token = auth.authenticated;
    const response = await axios.patch(`${MAPOHOLIC_SERVER}/clubs/${clubId}`, formValues, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: CLUB_UPDATED, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(CLUB_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};

// delete the specified club (multiple deletion not supported)
// app.delete('/clubs/:id', requireAuth, Clubs.deleteClub);
export const deleteClubAction = (clubId, callback) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { auth } = state;
    const token = auth.authenticated;
    const response = await axios.delete(`${MAPOHOLIC_SERVER}/clubs/${clubId}`, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch({ type: CLUB_DELETED, payload: response.data });
    if (callback) callback(true);
  } catch (err) {
    handleError(CLUB_ERROR)(err, dispatch);
    if (callback) callback(false);
  }
};
