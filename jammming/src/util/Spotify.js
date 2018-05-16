let accessToken = '';
var clientId = '94f67a9748194f0aa1b37009402b08c1';
var redirectUri = 'http://playlister.surge.sh';

const Spotify = {

    getAccessToken() {
        if (accessToken !== '') {
            return accessToken;
        }

        const url = window.location.href;

        if (url.match(/access_token=([^&]*)/) !== null && url.match(/expires_in=([^&]*)/) !== null && url.match(/access_token=([^&]*)/).length > 1 && url.match(/expires_in=([^&]*)/).length > 1) {
            accessToken = url.match(/access_token=([^&]*)/)[1];
            const expiresIn = url.match(/expires_in=([^&]*)/)[1];

            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState(accessToken, null, '/');
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        }
    },
    search(term) {

        if (accessToken === '') {
            this.getAccessToken();
        }

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {

            if (jsonResponse.tracks) {

                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }));

            }
        });
    },
    savePlaylist(name, trackURIs) {
        if (name === '' || trackURIs.length === 0) {
            return;
        }

        const headers = {
            Authorization: `Bearer ${accessToken}`
        };

        let userId = '';
        let playlistID = '';

        //Get userId
        fetch(`https://api.spotify.com/v1/me`, {
            headers: headers
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (jsonResponse.id) {
                userId = jsonResponse.id;

                //Create new playlist
                fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({
                        name: name,
                        description: `${name} description`,
                        public: true
                    })
                }).then(response => {
                    return response.json();
                }).then(jsonResponse => {
                    if (jsonResponse.id) {
                        playlistID = jsonResponse.id;

                        //Adds tracks to playlist
                        fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
                            headers: headers,
                            method: 'POST',
                            body: JSON.stringify({
                                uris: trackURIs
                            })
                        }).then(response => {

                        });

                    }
                });

            }
        });

    }
};

export default Spotify;