// eslint-disable-next-line import/no-extraneous-dependencies
const autoBind = require('auto-bind');

class PlaylistSongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.verifySongExist(songId);
    console.log(songId, playlistId);

    await this._service.addSong({
      playlistId,
      songId,
    });

    const response = h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan ke Playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongHandler(request) {
    const { id: playlistId } = request.params;
    const selectedPlaylist = await this._service.getPlaylistById(playlistId);
    console.log(selectedPlaylist);
    const songs = await this._service.getSongsByPlaylistId(playlistId);
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);

    const playlist = {
      ...selectedPlaylist,
      songs,
    };
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongHandler(request) {
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deleteSongFromPlaylist(playlistId, songId);

    return {
      status: 'success',
      message: 'Song berhasil dihapus dari Playlist',
    };
  }
}

module.exports = PlaylistSongsHandler;
