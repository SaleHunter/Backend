const { cloudinary } = require('../utils/cloudinaryUtils');

class Service {
  async uploadProfilePhoto(fileStr) {
    try {
      const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: 'profileImages',
      });

      return uploadedResponse;
    } catch (e) {
      console.log({ error: 'error in cloudinary service' });
      return {};
    }
  }
}
module.exports = new Service();
