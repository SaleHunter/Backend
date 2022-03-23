class Helper {
  buildFilterObject(query) {
    const key = query.filterBy;
    const value = query.filterValue;
    if (key && value) {
      return { key, value };
    }

    return null;
  }

  buildPaginationObject(query) {
    return {
      page: query.page || 1,
      limit: query.limit || 20,
    };
  }

  buildUserLocationObject(headers) {
    const lan = headers.lan;
    const lat = headers.lat;
    if (lan && lat) {
      return { lan, lat };
    }

    return null;
  }
}

module.exports = new Helper();
