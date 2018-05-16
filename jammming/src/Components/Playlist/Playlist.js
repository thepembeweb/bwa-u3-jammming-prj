import React from 'react';
import './Playlist.css';

import TrackList from '../TrackList/TrackList';


class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(event) {
    const name = event.target.value;
    this.props.onNameChange(name);
  }

  render() {
    return (
      <div className="Playlist">
        <input onChange={this.handleNameChange} defaultValue={'New Playlist'}/>
        <TrackList isRemoval={true} onAdd={this.props.onAdd} onRemove={this.props.onRemove} tracks={this.props.playlistTracks} />
        <a onClick={this.props.onSave} className="Playlist-save">SAVE TO SPOTIFY</a>
      </div>
    );
  }
}

export default Playlist;