import { itineraryIcons } from '../data/itineraryAssets';
import type { TripItinerary } from '../types/itinerary';

type ApiActivity = {
  id: string;
  time: string;
  title: string;
  description: string;
  accentColor: string;
  iconBackground: string;
  iconKey: keyof typeof itineraryIcons;
  dotKey: keyof typeof itineraryIcons;
};

type ApiTripItinerary = {
  id: string;
  title: string;
  subtitle: string;
  days: {
    id: string;
    label: string;
    activities: ApiActivity[];
  }[];
};

export function hydrateItineraryFromApi(payload: ApiTripItinerary): TripItinerary {
  return {
    id: payload.id,
    title: payload.title,
    subtitle: payload.subtitle,
    days: payload.days.map((day) => ({
      id: day.id,
      label: day.label,
      activities: day.activities.map((activity) => ({
        id: activity.id,
        time: activity.time,
        title: activity.title,
        description: activity.description,
        accentColor: activity.accentColor,
        iconBackground: activity.iconBackground,
        Icon: itineraryIcons[activity.iconKey],
        Dot: itineraryIcons[activity.dotKey],
      })),
    })),
  };
}
