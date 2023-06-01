const InvariantError = require('../../exceptions/InvariantError');
const { AlbumCoversSchema } = require('./schema');

const UploadsValidator = {
  validateAlbumCover: (headers) => {
    const validationResult = AlbumCoversSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UploadsValidator;
