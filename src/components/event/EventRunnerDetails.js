import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

import Collapse from '../Collapse';
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const EventRunnerDetails = ({
  canEdit,
  selectedEvent,
  selectedRunner,
  setEventViewModeRunner,
}) => {
  if (!selectedEvent._id) {
    return (
      <div className="ui segment">
        <div className="ui active inline centered text loader"><Trans>Loading event details...</Trans></div>
      </div>
    );
  }
  const selectedRunnerDetails = selectedEvent.runners
    .find(runner => runner.user._id === selectedRunner);
  if (!selectedRunnerDetails) {
    return (
      <div className="ui segment">
        <p><Trans>Sorry, no matching runner details were found.</Trans></p>
      </div>
    );
  }
  // console.log('selectedRunnerDetails', selectedRunnerDetails);
  const {
    user,
    courseTitle,
    courseLength,
    courseClimb,
    courseControls,
    fullResults,
    time,
    place,
    timeBehind,
    fieldSize,
    tags,
    // maps,
    // comments,
  } = selectedRunnerDetails;
  const { displayName, fullName } = user;

  const renderHeader = (
    <h3 className="header">
      {`${displayName} ${(fullName && fullName !== '') ? `(${fullName})` : ''}`}
    </h3>
  );
  const courseTitleToDisplay = (courseTitle && courseTitle !== '')
    ? (
      <Trans>
        {'Course: '}
        <span className="course-title">{courseTitle}</span>
      </Trans>
    )
    : null;
  const courseLengthToDisplay = (courseLength && courseLength !== '')
    ? `${courseLength}km, `
    : '';
  const courseClimbToDisplay = (courseClimb && courseClimb !== '')
    ? `${courseClimb}m, `
    : '';
  const courseControlsToDisplay = (courseControls && courseControls !== '')
    ? <Trans>{`${courseControls} controls`}</Trans>
    : '';
  const renderCourseDetails = (courseTitleToDisplay)
    ? (
      <div className="item">
        {courseTitleToDisplay}
        {(courseLengthToDisplay || courseClimbToDisplay || courseControlsToDisplay)
          ? (
            <span>
              {' ('}
              {courseLengthToDisplay}
              {courseClimbToDisplay}
              {courseControlsToDisplay}
              {')'}
            </span>
          )
          : ''}
      </div>
    )
    : <div className="item"><Trans>No course details to display</Trans></div>;
  const resultTimeToDisplay = (time && time !== '')
    ? (
      <Trans>
        {'Result: '}
        <span className="course-title">{time}</span>
      </Trans>
    )
    : null;
  const resultFieldSizeToDisplay = (fieldSize && fieldSize !== '')
    ? <Trans>{`of ${fieldSize}`}</Trans>
    : '';
  const renderResultSummary = (resultTimeToDisplay)
    ? (
      <div className="item">
        {resultTimeToDisplay}
        {((place && place !== '') || (timeBehind && timeBehind !== ''))
          ? (
            <span>
              {(timeBehind) ? ` (${timeBehind}, ` : ' ('}
              {place || ''}
              {(resultFieldSizeToDisplay !== '') ? ' ' : ''}
              {resultFieldSizeToDisplay}
              {')'}
            </span>
          )
          : ''}
      </div>
    )
    : <div className="item"><Trans>No result to display</Trans></div>;
  const renderResultsInfo = (fullResults.length > 0)
    ? (
      <div className="item">
        <Trans>{`See below for results (${fullResults.length} runners)`}</Trans>
      </div>
    )
    : null;
  const renderTags = (tags && tags.length > 0)
    ? (
      <span>
        {tags.map((tag) => {
          return <div key={tag} className="ui violet label">{tag}</div>;
        })}
      </span>
    )
    : null;
  const renderEditButtons = (canEdit)
    ? (
      <div>
        <hr className="divider" />
        <button type="button" className="ui red tiny button right floated" onClick={() => setEventViewModeRunner('delete')}>
          <Trans>Delete runner</Trans>
        </button>
        <button type="button" className="ui primary tiny button" onClick={() => setEventViewModeRunner('edit')}>
          <Trans>Edit runner details</Trans>
        </button>
      </div>
    )
    : null;
  const displayEventRunnerDetails = (
    <div>
      {renderHeader}
      <div className="ui list">
        {renderCourseDetails}
        {renderResultSummary}
        {renderResultsInfo}
      </div>
      <div>{renderTags}</div>
      {renderEditButtons}
    </div>
  );
  // <div className="item">{`${maps.length} maps, see below`}</div>
  // <div className="item">{`${comments.length} comments, see below`}</div>

  const title = <Trans>Runner details</Trans>;
  return (
    <div className="ui segment">
      <Collapse title={title}>
        {displayEventRunnerDetails}
      </Collapse>
    </div>
  );
};

EventRunnerDetails.propTypes = {
  canEdit: PropTypes.bool,
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  selectedRunner: PropTypes.string,
  setEventViewModeRunner: PropTypes.func.isRequired,
};
EventRunnerDetails.defaultProps = {
  canEdit: false,
  selectedEvent: {},
  selectedRunner: '',
};

export default EventRunnerDetails;
