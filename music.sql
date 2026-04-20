select   stage_name, title, release_date
from     artists
join     albums using (artist_id)
order by release_date desc
limit    10;

select   title, release_date, riaa_certificate
from     albums
join     artists using (artist_id)
where    stage_name = 'Metallica'
order by title asc;

select   t.title, t.milliseconds
from     tracks t
join     albums a using (album_id)
where    a.title = 'The White Album'
order by t.milliseconds asc;

select   t.title, t.milliseconds
from     tracks t
join     albums using (album_id)
join     artists using (artist_id)
where    stage_name = 'The Beatles'
order by t.milliseconds asc;


select   t.title as track, t.milliseconds as playing_time, g.name as genre
from     tracks t
join     albums using (album_id)
join     artists using (artist_id)
join     genres g using (genre_id)
where    stage_name = 'The Beatles'
order by t.milliseconds asc;

select distinct m.name
from   media_types m
join   tracks using (media_type_id)
join   albums using (album_id)
join   artists using (artist_id)
join   playlist_track using (track_id)
join   playlists p using (playlist_id)
where  nationality = 'GB' and p.name = 'Heavy Metal Classic';

select distinct nationality
from   artists
join   albums using (artist_id)
join   tracks using (album_id)
join   genres g using (genre_id)
join   playlist_track using (track_id)
join   playlists using (playlist_id)
join   users using (user_id)
where  screen_name = 'Susanne' and g.name = 'Rock';

select   stage_name, count(*) as album_count
from     artists
join     albums using (artist_id)
group by stage_name
order by album_count desc


Opgave C1-1
alter table tracks
add constraint tracks_milliseconds_check
check (milliseconds >= 0);

Opgave C1-2
update tracks
set    milliseconds = 'abc'
where  track_id = 31;
-- ovenstående bliver invalid syntax error

Opgave C1-3
update tracks
set    milliseconds = null
where  track_id = 31;
-- Dette kan godt lade sig gøre da null blot er en værdi vi ikke kender og SQL lader tvivlen komme os til gode

Opgave C1-4
alter table tracks
add constraint making_money
check (unit_price > 0.50 + 0.13 * (bytes / 10000000.0));

update tracks
set    unit_price = 1.49
where  track_id in (620, 1666);

alter table tracks
add constraint making_money
check (unit_price > 0.50 + 0.13 * (bytes / 10000000.0));



Opgave C2-1
alter table artists
alter column nationality
set not null;

Opgave C2-2
insert into artists (artist_id, stage_name)
values (300, 'Laufey');
-- ovenstående kan man. ikke når der ikke gives info om not null

Opgave C2-3
alter table artists
add column active boolean not null default true;

Opgave C2-4
insert into artists (artist_id, stage_name, nationality)
values (300, 'Laufey', 'IS');



Opgave C3-1
alter table artists
add constraint unique_stage_name
unique (stage_name);

Opgave C3-2
alter table artists
drop constraint unique_stage_name;
-- Fjerner constraint der ikke tillader samme stage_name uanset

alter table artists
add constraint unique_stage_name_nationality
unique (stage_name, nationality);
-- Laver en ny constraint som sørger for man kan hedde det samme, men kun hvis nationaliteten er den forskellig

insert into artists (artist_id, stage_name, nationality)
values (301, 'Nirvana', 'GB'); 
-- her har vi indsat bandet nirvana så det er en del af databasen


Opgave C4-1
delete from albums
where artist_id not in (select artist_id from artists);

alter table albums
add constraint artist_fk
foreign key (artist_id)
references artists (artist_id);

Opgave C4-2
delete from tracks
where album_id not in (select album_id from albums);

alter table tracks
add constraint album_fk
foreign key (album_id)
references albums (album_id);

Opgave C4-3
delete from playlists
where user_id not in (select user_id from users);

alter table playlists
add constraint user_fk
foreign key (user_id)
references users (user_id);


Opgave C4-4
delete from playlist_track
where track_id not in (select track_id from tracks);

alter table playlist_track
add constraint track_fk
foreign key (track_id)
references tracks (track_id);


delete from playlist_track
where playlist_id not in (select playlist_id from playlists);

alter table playlist_track
add constraint playlist_fk
foreign key (playlist_id)
references playlists (playlist_id);


Opgave C4-5

