import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { reformatTimestampDateOnly } from '../../common/conversions';

// The EventRunnerDelete component renders a confirmation dialogue for deleting a
// runner from an event
class EventRunnerDelete extends Component {
  static propTypes = {
    deleteEventRunner: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    selectedEvent: PropTypes.objectOf(PropTypes.any),
    selectedRunner: PropTypes.string,
    setEventViewModeRunner: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedEvent: null,
    selectedRunner: null,
  };

  render() {
    const {
      deleteEventRunner,
      language,
      selectedEvent,
      selectedRunner,
      setEventViewModeRunner,
    } = this.props;
    if (!selectedEvent || !selectedRunner) return null;
    const {
      _id: eventId,
      name,
      date,
      runners,
    } = selectedEvent;
    const runnerDetails = runners.find(({ user }) => {
      const { _id: userId } = user;
      return userId === selectedRunner;
    });
    if (!runnerDetails) return null;
    const runnerName = runnerDetails.user.displayName;
    return (
      <div className="ui segment">
        <h3><Trans>Delete Runner</Trans></h3>
        <p>
          <Trans>
            {`You are about to delete ${runnerName} from ${name} (${reformatTimestampDateOnly(date, language)}).`}
          </Trans>
        </p>
        <button
          type="button"
          className="ui tiny red button"
          onClick={() => {
            deleteEventRunner(eventId, selectedRunner, (didSucceed) => {
              if (didSucceed) {
                setEventViewModeRunner('view');
              }
            });
          }}
        >
          <Trans>{`Delete ${runnerName}?`}</Trans>
        </button>
        <button
          type="button"
          className="ui tiny button right floated"
          onClick={() => setEventViewModeRunner('view')}
        >
          <Trans>Cancel</Trans>
        </button>
      </div>
    );
  }
}

export default EventRunnerDelete;
