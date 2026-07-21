import BackButtonBg from '../../assets/images/itinerary/back-button-bg.svg';
import IconBeach from '../../assets/images/itinerary/icon-beach.svg';
import IconChevL from '../../assets/images/itinerary/icon-chev-l.svg';
import IconChevR from '../../assets/images/itinerary/icon-chev-r.svg';
import IconCity from '../../assets/images/itinerary/icon-city.svg';
import IconClock from '../../assets/images/itinerary/icon-clock.svg';
import IconGlobe from '../../assets/images/itinerary/icon-globe.svg';
import IconStar from '../../assets/images/itinerary/icon-star.svg';
import DotBlue from '../../assets/images/itinerary/dot-blue.svg';
import DotCyan from '../../assets/images/itinerary/dot-cyan.svg';
import DotPurple from '../../assets/images/itinerary/dot-purple.svg';
import DotOrange from '../../assets/images/itinerary/dot-orange.svg';

export const itineraryImages = {
  header: require('../../assets/images/itinerary/header.jpg'),
} as const;

export const itineraryIcons = {
  backButtonBg: BackButtonBg,
  chevL: IconChevL,
  chevR: IconChevR,
  clock: IconClock,
  beach: IconBeach,
  city: IconCity,
  star: IconStar,
  globe: IconGlobe,
  dotBlue: DotBlue,
  dotCyan: DotCyan,
  dotPurple: DotPurple,
  dotOrange: DotOrange,
} as const;
