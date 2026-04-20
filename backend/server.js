import express from 'express';
import { pool } from '../db/connect.js';

const db = pool();

const port = 3002;
const server = express();
server.use(express.static('frontend'));
server.use(onEachRequest);
server.get('/api/artist/:id', onGetArtistById);
server.get('/api/albumsByReleaseDate', onGetAlbumsByReleaseDate);
server.get('/api/artist/:artist/albums', onGetAlbumsForArtist);
server.get('/api/album/:album/tracks', onGetTracksForAlbum);
server.get('/api/artist/:artist/tracks', onGetTracksForArtist);
server.get('/api/artist/:artist/tracksWithGenre', onGetTracksWithGenreForArtist);
server.get('/api/playlist/:playlist/nationality/:nationality/mediaTypes', onGetMediaTypesForPlaylistAndNationality);
server.get('/api/user/:user/genre/:genre/nationalities', onGetNationalitiesForUserAndGenre);
server.get('/api/albumCountByArtist', onGetAlbumCountByArtist);
server.listen(port, onServerReady);

async function onGetArtistById(request, response) {
    const id = request.params.id;
    const dbResult = await db.query(`
        select stage_name, nationality
        from   artists
        where  artist_id = $1`, [id]);
    const rows = dbResult.rows;
    if (rows.length === 0) {
        response.sendStatus(404);
    } else {
        response.json(rows[0]);
    }
}

async function onGetAlbumsByReleaseDate(request, response) {
    const limit = request.query.limit;
    const dbResult = await db.query(`
        select   stage_name, title, release_date
        from     artists
        join     albums using (artist_id)
        order by release_date desc
        limit    $1`, [limit]);
    response.json(dbResult.rows);
}

async function onGetAlbumsForArtist(request, response) {
    const artist = request.params.artist;
    const limit = request.query.limit;
    const dbResult = await db.query(`
        select   title, release_date, riaa_certificate
        from     albums
        join     artists using (artist_id)
        where    stage_name = $1
        order by title asc
        limit    $2`, [artist, limit]);
    response.json(dbResult.rows);
}

async function onGetTracksForAlbum(request, response) {
    const album = request.params.album;
    const dbResult = await db.query(`
        select   t.title, t.milliseconds
        from     tracks t
        join     albums a using (album_id)
        where    a.title = $1
        order by t.milliseconds asc`, [album]);
    response.json(dbResult.rows);
}

async function onGetTracksForArtist(request, response) {
    const artist = request.params.artist;
    const dbResult = await db.query(`
        select   t.title, t.milliseconds
        from     tracks t
        join     albums using (album_id)
        join     artists using (artist_id)
        where    stage_name = $1
        order by t.milliseconds asc`, [artist]);
    response.json(dbResult.rows);
}

async function onGetTracksWithGenreForArtist(request, response) {
    const artist = request.params.artist;
    const dbResult = await db.query(`
        select   t.title as track, t.milliseconds as playing_time, g.name as genre
        from     tracks t
        join     albums using (album_id)
        join     artists using (artist_id)
        join     genres g using (genre_id)
        where    stage_name = $1
        order by t.milliseconds asc`, [artist]);
    response.json(dbResult.rows);
}

async function onGetMediaTypesForPlaylistAndNationality(request, response) {
    const nationality = request.params.nationality;
    const playlist = request.params.playlist;
    const dbResult = await db.query(`
        select distinct m.name
        from   media_types m
        join   tracks using (media_type_id)
        join   albums using (album_id)
        join   artists using (artist_id)
        join   playlist_track using (track_id)
        join   playlists p using (playlist_id)
        where  nationality = $1 and p.name = $2`, [nationality, playlist]);
    response.json(dbResult.rows);
}

async function onGetNationalitiesForUserAndGenre(request, response) {
    const user = request.params.user;
    const genre = request.params.genre;
    const dbResult = await db.query(`
        select distinct nationality
        from   artists
        join   albums using (artist_id)
        join   tracks using (album_id)
        join   genres g using (genre_id)
        join   playlist_track using (track_id)
        join   playlists using (playlist_id)
        join   users using (user_id)
        where  screen_name = $1 and g.name = $2`, [user, genre]);
    response.json(dbResult.rows);
}

async function onGetAlbumCountByArtist(request, response) {
    const limit = request.query.limit;
    const dbResult = await db.query(`
        select   stage_name, count(title) as album_count
        from     artists
        join     albums using (artist_id)
        group by stage_name
        order by album_count desc`);
    response.json(dbResult.rows);
}


function onServerReady() {
    console.log('Webserver running on port', port);
}

function onEachRequest(request, response, next) {
    console.log(new Date(), request.method, request.url);
    next();
}