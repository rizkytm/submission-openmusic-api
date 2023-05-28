const mapDBToModelAlbum = ({ id, name, year }) => ({
  id,
  name,
  year,
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

module.exports = { mapDBToModelAlbum, mapDBToModelSong, mapDBToModelAllSongs };
