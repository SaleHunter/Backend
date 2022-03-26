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
    const lon = headers.lon;
    const lat = headers.lat;
    if (lon && lat) {
      return { lon, lat };
    }

    return null;
  }
}

module.exports = new Helper();
