const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { mapDBToModelPlaylist, mapDBToModelAllSongs } = require('../../utils');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, owner, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner = null) {
    // const query = {
    //   text: 'SELECT * FROM playlists WHERE owner = $1',
    //   values: [owner],
    // };

    // const result = await this._pool.query(query);
    // return result.rows;
    const result = await this._pool.query(
      'SELECT playlists.*, users.username FROM playlists JOIN users ON users.id = playlists.owner;'
    );
    return result.rows.map(mapDBToModelPlaylist);
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: 'SELECT playlists.*, users.username FROM playlists JOIN users ON users.id = playlists.owner WHERE playlists.id = $1',
      values: [playlistId],
    };
    console.log(query);
    const result = await this._pool.query(query);
    console.log(result.rows);
    // try {
    // } catch (error) {
    //   console.log(error.message);
    // }
    console.log(result.rows.map(mapDBToModelPlaylist)[0]);
    return result.rows.map(mapDBToModelPlaylist)[0];
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async addSong({ playlistId, songId }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    console.log(id, playlistId, songId, createdAt, updatedAt);

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, playlistId, songId, createdAt, updatedAt],
    };

    console.log(query);
    const result = await this._pool.query(query);
    // try {
    // } catch (error) {
    //   console.log(error.message);
    // }

    if (!result.rows[0].id) {
      throw new InvariantError('Song gagal ditambahkan ke Playlist');
    }

    return result.rows[0].id;
  }

  async getSongsByPlaylistId(playlistId) {
    const query = {
      text: 'SELECT songs.* FROM playlist_songs JOIN songs ON songs.id = playlist_songs.song_id WHERE playlist_id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModelAllSongs);
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'Song gagal dihapus dari Playlist. Id tidak ditemukan'
      );
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifySongExist(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }
  }
}

module.exports = PlaylistsService;
