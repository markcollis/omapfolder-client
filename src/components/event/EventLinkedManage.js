import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import memoize from 'memoize-one';

import EventLinkedList from './EventLinkedList';
import EventLinkedEdit from './EventLinkedEdit';
import EventLinkedDelete from './EventLinkedDelete';

// The EventLinkedManage component renders an interface for listing, selecting,
// editing and deleting links between events, independently of the event currently being viewed
class EventLinkedManage extends Component {
  state = {
    showEventLinkedList: false,
  };

  static propTypes = {
    createEventLink: PropTypes.func.isRequired,
    deleteEventLink: PropTypes.func.isRequired,
    eventLinkMode: PropTypes.string.isRequired,
    eventList: PropTypes.arrayOf(PropTypes.any),
    isAdmin: PropTypes.bool.isRequired,
    language: PropTypes.string.isRequired,
    linkList: PropTypes.arrayOf(PropTypes.any),
    selectedEvent: PropTypes.objectOf(PropTypes.any).isRequired,
    selectedEventLinkId: PropTypes.string.isRequired,
    setEventViewModeEventLink: PropTypes.func.isRequired,
    updateEventLink: PropTypes.func.isRequired,
  };

  static defaultProps = {
    eventList: [],
    linkList: [],
  };

  getEventLinkData = memoize((linkList, selectedEventLinkId) => {
    const selectedLink = linkList.find((eachLink) => {
      const { _id: linkId } = eachLink;
      return linkId === selectedEventLinkId;
    });
    return selectedLink;
  });

  renderEventLinkedList = () => {
    const {
      isAdmin,
      language,
      linkList,
      setEventViewModeEventLink,
    } = this.props;
    return (
      <EventLinkedList
        isAdmin={isAdmin}
        language={language}
        linkList={linkList}
        setEventViewModeEventLink={setEventViewModeEventLink}
      />
    );
  }

  renderEventLinkedAdd = () => {
    const {
      createEventLink,
      eventLinkMode,
      eventList,
      language,
      setEventViewModeEventLink,
    } = this.props;
    return (
      <EventLinkedEdit
        createEventLink={createEventLink}
        eventLinkMode={eventLinkMode}
        eventList={eventList}
        language={language}
        setEventViewModeEventLink={setEventViewModeEventLink}
      />
    );
  }

  renderEventLinkedEdit = () => {
    const {
      eventLinkMode,
      eventList,
      language,
      linkList,
      selectedEventLinkId,
      setEventViewModeEventLink,
      updateEventLink,
    } = this.props;
    const linkData = this.getEventLinkData(linkList, selectedEventLinkId);
    if (!linkData) return null;
    return (
      <EventLinkedEdit
        eventLinkMode={eventLinkMode}
        eventList={eventList}
        language={language}
        linkData={linkData}
        setEventViewModeEventLink={setEventViewModeEventLink}
        updateEventLink={updateEventLink}
      />
    );
  }

  renderEventLinkedDelete = () => {
    const {
      deleteEventLink,
      language,
      linkList,
      selectedEventLinkId,
      setEventViewModeEventLink,
    } = this.props;
    const linkData = this.getEventLinkData(linkList, selectedEventLinkId);
    if (!linkData) return null;
    return (
      <EventLinkedDelete
        deleteEventLink={deleteEventLink}
        language={language}
        linkData={linkData}
        setEventViewModeEventLink={setEventViewModeEventLink}
      />
    );
  }

  renderAddButton = () => {
    const { setEventViewModeEventLink } = this.props;
    return (
      <button
        type="button"
        className="ui tiny primary right floated button"
        onClick={() => setEventViewModeEventLink('add')}
      >
        <Trans>Add a new link</Trans>
      </button>
    );
  }

  renderShowHideListButton = () => {
    const { showEventLinkedList } = this.state;
    const buttonClass = (showEventLinkedList)
      ? 'ui tiny button'
      : 'ui tiny primary button';
    const buttonText = (showEventLinkedList)
      ? <Trans>Hide event link list</Trans>
      : <Trans>Show event link list</Trans>;
    return (
      <button
        type="button"
        className={buttonClass}
        onClick={() => this.setState({ showEventLinkedList: !showEventLinkedList })}
      >
        {buttonText}
      </button>
    );
  }

  render() {
    const {
      eventLinkMode,
      selectedEvent,
    } = this.props;
    const { showEventLinkedList } = this.state;
    const { _id: eventId } = selectedEvent;
    if (!eventId) return null;

    const titles = {
      view: <Trans>Manage linked events</Trans>,
      add: <Trans>Add new event link</Trans>,
      edit: <Trans>Edit event link</Trans>,
      delete: <Trans>Delete event link</Trans>,
    };
    const title = titles[eventLinkMode];

    return (
      <div className="ui segment">
        <h3 className="ui header">{title}</h3>
        {eventLinkMode === 'view'
          ? (
            <div>
              {(showEventLinkedList) ? this.renderEventLinkedList() : null}
              {this.renderShowHideListButton()}
              {this.renderAddButton()}
            </div>
          )
          : null}
        {eventLinkMode === 'add'
          ? this.renderEventLinkedAdd()
          : null}
        {eventLinkMode === 'edit'
          ? this.renderEventLinkedEdit()
          : null}
        {eventLinkMode === 'delete'
          ? this.renderEventLinkedDelete()
          : null}
      </div>
    );
  }
}

export default EventLinkedManage;
