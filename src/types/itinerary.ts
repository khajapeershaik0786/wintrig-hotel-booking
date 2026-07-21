import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';

export type SvgIcon = ComponentType<SvgProps>;

export type ItineraryActivity = {
  id: string;
  time: string;
  title: string;
  description: string;
  accentColor: string;
  iconBackground: string;
  Icon: SvgIcon;
  Dot: SvgIcon;
};

export type ItineraryDay = {
  id: string;
  label: string;
  activities: ItineraryActivity[];
};

export type TripItinerary = {
  id: string;
  title: string;
  subtitle: string;
  days: ItineraryDay[];
};
