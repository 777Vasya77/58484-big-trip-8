import {cities, dataFilters, tripPoints} from './data';
import {getRandomInteger, clearNode, getRandomArrayItems, generateTripPointsTitle, removeFromArray} from './util';
import getFilterItem from './get-filter-item';
import Point from './point';
import PointEdit from './point-edit';

const MIN_TRIP_POINTS = 1;
const MAX_TRIP_POINTS = 5;
const DEFAULT_POINT_COUNT = 7;
const tripFilterElement = document.querySelector(`.trip-filter`);
const tripDayItemsElement = document.querySelector(`.trip-day__items`);
const tripPointsElement = document.querySelector(`.trip__points`);

const getAllFilters = (filters) => {
  return filters.map((item) => getFilterItem(item));
};

const getAllTripPoints = (pointCount = null) => {
  const fragment = document.createDocumentFragment();
  const points = (pointCount)
    ? getRandomArrayItems(tripPoints, pointCount)
    : tripPoints;

  points.forEach((item) => {
    const point = new Point(item);
    const pointEdit = new PointEdit(item);

    const renderPointComponent = (newData = item) => {
      item = newData;

      point.update(item);
      point.render();
      tripDayItemsElement.replaceChild(point.element, pointEdit.element);
      pointEdit.unrender();
    };
    const renderPointEditComponent = () => {
      pointEdit.update(item);
      pointEdit.render();
      tripDayItemsElement.replaceChild(pointEdit.element, point.element);
      point.unrender();
    };

    point.onEdit = renderPointEditComponent;
    pointEdit.onCancel = renderPointComponent;

    pointEdit.onSubmit = (newData) => {
      renderPointComponent(newData);
    };

    pointEdit.onDelete = () => {
      removeFromArray(points, item);
      pointEdit.unrender();
    };

    point.render();
    fragment.appendChild(point.element);
  });

  return fragment;
};

const renderAllTripPoints = (pointCount = DEFAULT_POINT_COUNT) => {
  tripDayItemsElement.appendChild(getAllTripPoints(pointCount));
};

tripFilterElement.addEventListener(`click`, (evt) => {
  const pointCount = getRandomInteger(MIN_TRIP_POINTS, MAX_TRIP_POINTS);
  if (evt.target.tagName === `INPUT`) {
    clearNode(tripDayItemsElement);
    renderAllTripPoints(pointCount);
  }
});

tripFilterElement.insertAdjacentHTML(`beforeend`, getAllFilters(dataFilters).join(``));
tripPointsElement.insertAdjacentHTML(`beforeend`, generateTripPointsTitle(cities));
renderAllTripPoints();
