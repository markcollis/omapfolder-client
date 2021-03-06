import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import Collapse from '../generic/Collapse';
import EventRunnersItem from './EventRunnersItem';

// The EventRunners component renders a list of runners at an event
const EventRunners = ({
  addEventRunner,
  addEventRunnerOris,
  currentUserId,
  currentUserOrisId,
  handleSelectEventRunner,
  history,
  selectedEvent,
  selectedRunner,
  selectEventId,
  selectRunnerToDisplay,
}) => {
  const { _id: selectedEventId } = selectedEvent;
  if (!selectedEventId) return null;
  const { runners, orisId } = selectedEvent;
  const isCurrentRunner = Boolean(runners && runners.some(({ user }) => {
    const { _id: runnerId } = user;
    return runnerId === currentUserId;
  }));
  const runnersByCourse = {};
  const runnersArray = [...runners]
    .sort((a, b) => {
      return (a.user.displayName < b.user.displayName) ? 0 : -1;
    });
  runnersArray.forEach((runner) => {
    const { _id: runnerId, courseTitle } = runner;
    const courseTitleKey = (!courseTitle || courseTitle === '') ? 'none' : courseTitle;
    const runnerToAdd = (
      <EventRunnersItem
        key={runnerId}
        currentUserId={currentUserId}
        eventId={selectedEventId}
        handleSelectEventRunner={handleSelectEventRunner}
        runner={runner}
        selectedRunner={selectedRunner}
      />
    );
    if (runnersByCourse[courseTitleKey]) {
      runnersByCourse[courseTitleKey].push(runnerToAdd);
    } else {
      runnersByCourse[courseTitleKey] = [runnerToAdd];
    }
  });
  const courseTitles = Object.keys(runnersByCourse);
  // want to display '[unknown course]' only if other runners have a defined course
  const missingCourseTitle = (courseTitles.length > 1) ? <Trans>[unknown course]</Trans> : '';
  const runnersToDisplay = courseTitles.map((courseTitle) => {
    const courseTitleToDisplay = (courseTitle === 'none')
      ? missingCourseTitle
      : courseTitle;
    return ( // can't use <> shorthand for Fragment with key
      <Fragment key={courseTitle}>
        <h3 className="event-runners__class-title">{courseTitleToDisplay}</h3>
        {runnersByCourse[courseTitle].map((el) => el)}
      </Fragment>
    );
  });

  const useOrisToAdd = Boolean(orisId && orisId !== '' && currentUserOrisId && currentUserOrisId !== '');
  const renderEventRunnerAdd = (isCurrentRunner || !currentUserId)
    ? null
    : (
      <button
        type="button"
        className="ui tiny primary right floated button"
        onClick={() => {
          if (useOrisToAdd) {
            addEventRunnerOris(selectedEventId, (successful) => {
              if (successful) {
                selectEventId(selectedEventId);
                selectRunnerToDisplay(currentUserId);
                history.push('/mapview');
                window.scrollTo(0, 0);
              }
            });
          } else {
            addEventRunner(selectedEventId, (successful) => {
              if (successful) {
                selectEventId(selectedEventId);
                selectRunnerToDisplay(currentUserId);
                history.push('/mapview');
                window.scrollTo(0, 0);
              }
            });
          }
        }}
      >
        <Trans>Add yourself as a runner</Trans>
      </button>
    );
  const title = <Trans>Runners at event (select one to see their maps)</Trans>;
  return (
    <div className="ui segment">
      <Collapse title={title}>
        <div className="ui link cards card-list">
          {runnersToDisplay}
        </div>
        {renderEventRunnerAdd}
      </Collapse>
    </div>
  );
};

EventRunners.propTypes = {
  addEventRunner: PropTypes.func.isRequired,
  addEventRunnerOris: PropTypes.func.isRequired,
  currentUserId: PropTypes.string,
  currentUserOrisId: PropTypes.string,
  handleSelectEventRunner: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  selectedEvent: PropTypes.objectOf(PropTypes.any),
  selectedRunner: PropTypes.string,
  selectEventId: PropTypes.func.isRequired,
  selectRunnerToDisplay: PropTypes.func.isRequired,
};
EventRunners.defaultProps = {
  currentUserId: null,
  currentUserOrisId: null,
  selectedEvent: {},
  selectedRunner: '',
};

export default withRouter(EventRunners);
