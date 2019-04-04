import API from '../api';
import ModelPoint from '../models/model-point';
import {removeFromArray, showLoadingMessage} from '../util';
import {ApiData, FilterName} from '../data';

const api = new API({
  endPoint: ApiData.END_POINT,
  authorization: ApiData.AUTHORIZATION
});

export default {
  state: {
    points: [],
    offers: [],
    destinations: [],
    filters: [
      {
        name: FilterName.EVERYTHING,
        checked: true
      },
      {
        name: FilterName.FUTURE,
        checked: false
      },
      {
        name: FilterName.PAST,
        checked: false
      }
    ]
  },

  getTypeOffers(type) {
    return this.state.offers.find((item) => item.type === type.toLowerCase()).offers;
  },

  getDestination(name) {
    return this.state.destinations.find((item) => item.name === name);
  },

  loadData() {
    showLoadingMessage();

    return Promise.all([
      this.fetchPoints(),
      this.fetchOffers(),
      this.fetchDestinations()
    ])
      .then(() => {
        this.state.isLoading = false;
      })
      .catch((error) => {
        throw new Error(error);
      });
  },

  fetchPoints() {
    return api.get(`points`)
      .then((data) => ModelPoint.parsePoints(data))
      .then((data) => {
        this.state.points = data;
      });
  },

  fetchOffers() {
    return api.get(`offers`)
      .then((data) => {
        this.state.offers = data;
      });
  },

  fetchDestinations() {
    return api.get(`destinations`)
      .then((data) => {
        this.state.destinations = data;
      });
  },

  storePoint(point) {
    const pointData = {
      'day': point.day,
      'type': point.type.title.toLowerCase(),
      'base_price': +point.price,
      'date_from': +point.timetable.from,
      'date_to': +point.timetable.to,
      'offers': point.offers,
      'destination': point.destination,
      'is_favorite': false
    };
    return api.create(`points`, {point: pointData})
      .then((response) => ModelPoint.parsePoint(response))
      .then((newPoint) => {
        this.state.points.unshift(newPoint);
      });
  },

  updatePoint(data) {
    const point = this.state.points.find((item) => item.id === data.id);

    return api.update(`points`, {id: data.id, data: point.toRAW()});
  },

  deletePoint(id) {
    const point = this.state.points.find((item) => item.id === id);

    return api.delete(`points`, {id}).then(removeFromArray(this.state.points, point));
  }
};