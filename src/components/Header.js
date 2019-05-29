import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { getCurrentUserAction, setLanguageAction } from '../actions';
import noAvatar from '../graphics/no-avatar.png';
import { OMAPFOLDER_SERVER } from '../config';

const Header = ({
  auth,
  currentUser,
  error,
  getCurrentUser,
  location,
  setLanguage,
  selectedEventDisplay,
  selectedRunner,
}) => {
  // console.log('auth, error, currentUser', auth, error, currentUser);
  if (auth && auth !== '' && error === '' && !currentUser) getCurrentUser();

  const userDetails = (currentUser)
    ? (
      <div>
        <img
          className="ui avatar image"
          alt="avatar"
          src={(currentUser && currentUser.profileImage) ? `${OMAPFOLDER_SERVER}/${currentUser.profileImage}` : noAvatar}
        />
        {`  ${currentUser.displayName}`}
      </div>
    )
    : '...';
  const isHome = (location.pathname === '/');
  const isSignup = (location.pathname === '/signup');
  const isLogin = (location.pathname === '/login');
  const isMyMapsList = (location.pathname === '/mymaps');
  const isMyMapsMap = (location.pathname === '/mymapsmap');
  const isMyMapsGroup = isMyMapsList || isMyMapsMap;
  const isEventsList = (location.pathname === '/events');
  const isEventsMap = (location.pathname === '/eventsmap');
  const isEventsGroup = isEventsList || isEventsMap;
  const isMapView = (location.pathname === '/mapview');
  const isUsers = (location.pathname === '/users');
  const isClubs = (location.pathname === '/clubs');
  const isCurrentUser = (location.pathname === '/me');

  const selectLanguage = (
    <div className="item">
      <i
        className="uk flag"
        role="button"
        onClick={() => setLanguage('en')}
        onKeyPress={() => setLanguage('en')}
        tabIndex="0"
      />
      <i
        className="cz flag"
        role="button"
        onClick={() => setLanguage('cs')}
        onKeyPress={() => setLanguage('cs')}
        tabIndex="0"
      />
    </div>
  );

  const myMapsSubMenu = (isMyMapsGroup)
    ? (
      <div className="ui top attached tabular menu">
        <Link to="/mymaps" className={(isMyMapsList) ? 'active item' : 'item'}>
          <Trans>List view</Trans>
        </Link>
        <Link to="/mymapsmap" className={(isMyMapsMap) ? 'active item' : 'item'}>
          <Trans>Map view</Trans>
        </Link>
      </div>
    )
    : null;

  const eventsSubMenu = (isEventsGroup)
    ? (
      <div className="ui top attached tabular menu">
        <Link to="/events" className={(isEventsList) ? 'active item' : 'item'}>
          <Trans>List view</Trans>
        </Link>
        <Link to="/eventsmap" className={(isEventsMap) ? 'active item' : 'item'}>
          <Trans>Map view</Trans>
        </Link>
      </div>
    )
    : null;

  if (auth) {
    return (
      <div>
        <div className="ui menu secondary pointing">
          <Link to="/" className={(isHome) ? 'active item' : 'item'}><i className="icon home" /></Link>
          {(selectedEventDisplay && selectedRunner)
            ? (
              <Link to="/mapview" className={(isMapView) ? 'active blue item' : 'item'}>
                <Trans>Current Map</Trans>
              </Link>
            )
            : null}
          <Link to="/mymaps" className={(isMyMapsGroup) ? 'active blue item' : 'item'}>
            <Trans>My Maps</Trans>
          </Link>
          <Link to="/events" className={(isEventsGroup) ? 'active blue item' : 'item'}>
            <Trans>Events</Trans>
          </Link>
          <Link to="/users" className={(isUsers) ? 'active blue item' : 'item'}>
            <Trans>Users</Trans>
          </Link>
          <Link to="/clubs" className={(isClubs) ? 'active blue item' : 'item'}>
            <Trans>Clubs</Trans>
          </Link>
          <div className="right menu">
            <Link to="/me" className={(isCurrentUser) ? 'active blue item header-current-user' : 'item header-current-user'}>{userDetails}</Link>
            <Link to="/logout" className="item right ">
              <Trans>Log Out</Trans>
            </Link>
            {selectLanguage}
          </div>
        </div>
        {myMapsSubMenu}
        {eventsSubMenu}
      </div>
    );
  }
  return (
    <div>
      <div className="ui menu secondary pointing">
        <Link to="/" className={(isHome) ? 'active blue item' : 'item'}><i className="icon home" /></Link>
        <Link to="/events" className={(isEventsGroup) ? 'active blue item' : 'item'}>
          <Trans>Browse Public Maps</Trans>
        </Link>
        <div className="right menu">
          <Link to="/signup" className={(isSignup) ? 'active blue item' : 'item'}>
            <Trans>Sign Up</Trans>
          </Link>
          <Link to="/login" className={(isLogin) ? 'active blue item' : 'item'}>
            <Trans>Log In</Trans>
          </Link>
          {selectLanguage}
        </div>
      </div>
      {eventsSubMenu}
    </div>
  );
};

Header.propTypes = {
  auth: PropTypes.string,
  currentUser: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.string,
  getCurrentUser: PropTypes.func.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  setLanguage: PropTypes.func.isRequired,
  selectedRunner: PropTypes.string,
  selectedEventDisplay: PropTypes.string,
};
Header.defaultProps = {
  auth: '',
  currentUser: null,
  error: '',
  selectedRunner: '',
  selectedEventDisplay: '',
};

const mapStateToProps = ({ auth, user, oevent }) => {
  return {
    auth: auth.authenticated,
    currentUser: user.current,
    error: user.errorMessage,
    selectedRunner: oevent.selectedRunner,
    selectedEventDisplay: oevent.selectedEventDisplay,
  };
};

export default connect(mapStateToProps, {
  getCurrentUser: getCurrentUserAction,
  setLanguage: setLanguageAction,
})(Header);
