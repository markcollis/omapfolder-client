/* eslint-disable react/prop-types */
import { FunctionComponent, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { OEvent, OEventPosition, OEventSummary } from '../../../types/event';

function isPosition(test: OEventPosition | undefined): test is OEventPosition {
  return Array.isArray((test as OEventPosition));
}

const getEventGroupBounds = (events: OEventSummary[] | OEvent[]): OEventPosition[] | undefined => {
  const eventCentres = events.map((event: OEventSummary | OEvent): OEventPosition | undefined => {
    if (!event.locLat || !event.locLong) return undefined;
    const position: OEventPosition = [event.locLat, event.locLong];
    return position;
  }).filter(isPosition);
  if (eventCentres.length === 0) return undefined;
  const mapBounds: OEventPosition[] = eventCentres.reduce((acc, val) => {
    const low = [
      (val[0] < acc[0][0]) ? val[0] : acc[0][0],
      (val[1] < acc[0][1]) ? val[1] : acc[0][1],
    ];
    const high = [
      (val[0] > acc[1][0]) ? val[0] : acc[1][0],
      (val[1] > acc[1][1]) ? val[1] : acc[1][1],
    ];
    return [low, high] as OEventPosition[];
  }, [
    [eventCentres[0][0] - 0.01, eventCentres[0][1] - 0.01],
    [eventCentres[0][0] + 0.01, eventCentres[0][1] + 0.01],
  ]);
  return mapBounds;
};

interface ResetMapBoundsGroupProps {
  events: OEventSummary[] | OEvent[];
}

// empty child component that uses useMap hook to reset map bounds if the selected event changes
const ResetMapBoundsGroup: FunctionComponent<ResetMapBoundsGroupProps> = ({ events }) => {
  const mapInstance = useMap();
  const [initialRender, setInitialRender] = useState(true);
  useEffect(() => {
    if (initialRender) {
      setInitialRender(false);
    } else {
      const newMapBounds = getEventGroupBounds(events);
      if (newMapBounds) {
        mapInstance.fitBounds(newMapBounds);
      }
    }
  }, [events]);
  return null;
};

export default ResetMapBoundsGroup;