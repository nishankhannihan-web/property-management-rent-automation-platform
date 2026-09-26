import highlandCourt from './images/property_highland_court_1790358750969.jpg';
import oakridgeCommons from './images/property_oakridge_commons_1790358763378.jpg';
import westviewLofts from './images/property_westview_lofts_1790405319014.jpg';
import southCongress from './images/property_south_congress_1790405333722.jpg';
import canyonCreek from './images/property_canyon_creek_1790405346787.jpg';
import travisPlaza from './images/property_travis_plaza_1790405359061.jpg';

export const PROPERTY_IMAGES_MAP: Record<string, string> = {
  'prop-1': highlandCourt,
  'prop-2': oakridgeCommons,
  'prop-3': westviewLofts,
  'prop-4': southCongress,
  'prop-5': canyonCreek,
  'prop-6': travisPlaza,
};

export const BUNDLED_PROPERTY_IMAGES: string[] = [
  highlandCourt,
  oakridgeCommons,
  westviewLofts,
  southCongress,
  canyonCreek,
  travisPlaza,
];

export const PUBLIC_FALLBACK_IMAGES: Record<string, string> = {
  'prop-1': '/images/property_highland_court.jpg',
  'prop-2': '/images/property_oakridge_commons.jpg',
  'prop-3': '/images/property_westview_lofts.jpg',
  'prop-4': '/images/property_south_congress.jpg',
  'prop-5': '/images/property_canyon_creek.jpg',
  'prop-6': '/images/property_travis_plaza.jpg',
};
