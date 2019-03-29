import {cities, dataFilters, PointType} from './data';
import {generateTripPointsTitle, removeFromArray} from './util';
import moment from 'moment';
// import moneyChart from './money-chart';
// import transportChart from './transport-chart';
import Point from './point';
import PointEdit from './point-edit';
import Filter from './filter';
import API from './api';
import ModelPoint from "./model-point";

const AUTHORIZATION = `Basic eo0w590ik29889a`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const FUTURE_FILTER = `future`;
const PAST_FILTER = `past`;

const tripFilterElement = document.querySelector(`.trip-filter`);
const tripDayItemsElement = document.querySelector(`.trip-day__items`);
const tripPointsElement = document.querySelector(`.trip__points`);
const statsSwitcher = document.querySelector(`a[href*=stat]`);
const tableSwitcher = document.querySelector(`a[href*=table]`);
const table = document.querySelector(`#table`);
const stats = document.querySelector(`#stats`);

statsSwitcher.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  table.classList.add(`visually-hidden`);
  stats.classList.remove(`visually-hidden`);
});

tableSwitcher.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  stats.classList.add(`visually-hidden`);
  table.classList.remove(`visually-hidden`);
});

const tripPoints = [];
const destinations = [];
const offers = [];
const getDestinations = (data) => destinations.push(...data);
const getOffers = (data) => offers.push(...data);

const getFilters = (filters) => {
  const fragment = document.createDocumentFragment();

  filters.forEach((item) => {
    const filter = new Filter(item);
    filter.render();
    filter.onFilter = () => {
      switch (filter.name) {
        case FUTURE_FILTER:
          renderTripPoints(
              tripPoints.filter((it) => it.timetable.from > +moment().format(`x`))
          );
          return;

        case PAST_FILTER:
          renderTripPoints(
              tripPoints.filter((it) => it.timetable.to < +moment().format(`x`))
          );
          return;

        default:
          renderTripPoints();
          return;
      }
    };

    fragment.appendChild(filter.element);
  });

  return fragment;
};

const getTripPoints = (points) => {
  const fragment = document.createDocumentFragment();

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
      pointEdit.destinations = destinations;
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
      removeFromArray(tripPoints, item);
      pointEdit.unrender();
    };

    pointEdit.onFavorite = () => {
      item.isFavorite = !item.isFavorite;
    };

    pointEdit.onDestination = (evt) => {
      const destination = destinations.filter((it) => {
        return it.name === evt.target.value;
      });

      pointEdit.destination = destination[0];
    };

    pointEdit.onType = (evt) => {
      const typeOffers = offers.filter((it) => {
        return it.type === evt.target.value;
      });
      const type = evt.target.value.toUpperCase().split(`-`).join(``);

      pointEdit.type = PointType[type];
      pointEdit.offers = typeOffers;
    };

    point.render();
    fragment.appendChild(point.element);
  });

  return fragment;
};

const renderTripPoints = (points = tripPoints) => {
  tripDayItemsElement.innerHTML = ``;
  tripDayItemsElement.appendChild(getTripPoints(points));
};

const renderFilters = () => {
  tripFilterElement.appendChild(getFilters(dataFilters));
};

tripPointsElement.insertAdjacentHTML(`beforeend`, generateTripPointsTitle(cities));

api.get(`destinations`).then((response) => getDestinations(response));
api.get(`offers`).then((response) => getOffers(response));
api.get(`points`)
  .then((points) => ModelPoint.parsePoints(points))
  .then((points) => {
    tripPoints.push(...points);
    renderFilters();
    renderTripPoints(points);
  });

// moneyChart.render();
// transportChart.render();
