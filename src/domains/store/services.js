const DAL = require('./DAL');
const { cloudinary } = require('../../config/cloudinary');

class Service {
  async getAllStores(userId) {
    try {
      const stores = await DAL.getAllStores(userId);

      return stores;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getStoreById(storeId, pagination, userId) {
    try {
      return await DAL.getStoreById(storeId, pagination, userId);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createStore(userId, storeInfo) {
    try {
      // console.log(storeInfo);
      if (storeInfo.logo)
        storeInfo.logo = await this.uploadStoreLogo(storeInfo.logo);

      const store = await DAL.createStore(userId, storeInfo);

      return store;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteStoreById(userId, storeId) {
    try {
      await DAL.deleteStoreById(userId, storeId);

      return;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async uploadStoreLogo(logoString) {
    try {
      const uploadedResponse = await cloudinary.uploader.upload(logoString, {
        upload_preset: 'storeLogos',
      });
      console.log(uploadedResponse.url);
      return uploadedResponse.url;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateStoreById(userId, storeId, newValues) {
    try {
      if (newValues.logo) {
        const uploadedResponse = await this.uploadStoreLogo(newValues.logo);
        newValues.logo = uploadedResponse.url;
      }

      const store = await DAL.updateStoreById(userId, storeId, newValues);

      return store;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = new Service();
