import React from 'react';
import PropTypes from 'prop-types';

import { roleOptionsLocale } from '../../common/formData';
import noAvatar from '../../graphics/noAvatar.jpg';

// The UserListItem component renders a summary of a user's details as a selectable list item
const UserListItem = ({
  currentUserId,
  language,
  selectUserToDisplay,
  selectedUserId,
  setUserViewMode,
  user,
}) => {
  const {
    _id: userId,
    profileImage,
    displayName,
    fullName,
    memberOf,
    role,
  } = user;
  const roleOptions = roleOptionsLocale[language];
  const roleAdminName = roleOptions.find((el) => el.value === 'admin').label;
  const roleGuestName = roleOptions.find((el) => el.value === 'guest').label;
  let cardClass = 'ui fluid centered card';
  if (currentUserId === userId) cardClass = cardClass.concat(' card-list--item-current-user');
  if (selectedUserId === userId) cardClass = cardClass.concat(' card-list--item-selected');

  return (
    <div
      className={cardClass}
      role="button"
      onClick={() => {
        selectUserToDisplay(userId);
        setUserViewMode('view');
      }}
      onKeyPress={() => {
        selectUserToDisplay(userId);
        setUserViewMode('view');
      }}
      tabIndex={0}
    >
      <div className="content">
        <img
          className="left floated ui tiny image user-list-item--profile-image"
          alt="avatar"
          src={profileImage || noAvatar}
          onError={(e) => {
            e.target.src = noAvatar; // if loading profileImage fails
          }}
        />
        <div className="header">
          {displayName}
        </div>
        <div className="meta">
          {fullName}
          {(memberOf && memberOf.length > 0)
            ? (
              <div className="tags-group">
                {memberOf.map((club) => {
                  const { _id: clubId, shortName } = club;
                  return <div key={clubId} className="ui label">{shortName}</div>;
                })}
              </div>
            )
            : null}
        </div>
      </div>
      {(role === 'admin' || role === 'guest')
        ? (
          <div className="extra content">
            <div className="right floated">
              {(role === 'admin') ? roleAdminName : roleGuestName}
            </div>
          </div>
        )
        : null}
    </div>
  );
};

UserListItem.propTypes = {
  currentUserId: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  selectUserToDisplay: PropTypes.func.isRequired,
  selectedUserId: PropTypes.string.isRequired,
  setUserViewMode: PropTypes.func.isRequired,
};

export default UserListItem;
