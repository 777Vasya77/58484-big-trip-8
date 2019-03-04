import {dataFilters, tripPoints} from './data';
import {getRandomInteger, clearNode, getRandomArrayItems} from './util';
import getFilterItem from './get-filter-item';
import getTripPointItem from './get-trip-point-item';

const MIN_TRIP_POINTS = 1;
const MAX_TRIP_POINTS = 5;
const tripFilterElement = document.querySelector(`.trip-filter`);
const tripDayItemsElement = document.querySelector(`.trip-day__items`);

const getAllFilters = (filters) => {
  return filters.map((item) => getFilterItem(item));
};

const getAllTripPoints = (pointCount = null) => {
  let points = tripPoints;

  if (pointCount) {
    points = getRandomArrayItems(tripPoints, pointCount);
  }

  return points.map((item) => getTripPointItem(item));
};

tripFilterElement.addEventListener(`click`, (evt) => {
  const pointCount = getRandomInteger(MIN_TRIP_POINTS, MAX_TRIP_POINTS);
  if (evt.target.tagName === `INPUT`) {
    clearNode(tripDayItemsElement);
    tripDayItemsElement.insertAdjacentHTML(`beforeend`, getAllTripPoints(pointCount).join(``));
  }
});

tripFilterElement.insertAdjacentHTML(`beforeend`, getAllFilters(dataFilters).join(``));
tripDayItemsElement.insertAdjacentHTML(`beforeend`, getAllTripPoints().join(``));
