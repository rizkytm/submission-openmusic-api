const mapDBToModelAlbum = ({ id, name, year, cover }) => ({
  id,
  name,
  year,
  coverUrl: cover,
});

const mapDBToModelSong = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

const mapDBToModelAllSongs = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

const mapDBToModelPlaylist = ({ id, name, username }) => ({
  id,
  name,
  username,
});

module.exports = {
  mapDBToModelAlbum,
  mapDBToModelSong,
  mapDBToModelAllSongs,
  mapDBToModelPlaylist,
};
