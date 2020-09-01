import React, { useState } from "react";
import { GoogleApiWrapper, Map, Marker, InfoWindow } from "google-maps-react";

class HutMap extends React.Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  };

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });
  };

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };

  render() {
    return (
      <div className="row p-2 mb-4">
        <Map
          onClick={this.onMapClicked}
          google={this.props.google}
          initialCenter={{
            lat: this.props.lat,
            lng: this.props.long,
          }}
          center={{ lat: this.props.lat, lng: this.props.long }}
          zoom={12}
          containerStyle={{
            width: "100%",
            height: "400px",
            position: "relative",
          }}
        >
          <Marker
            onClick={this.onMarkerClick}
            title={this.props.name}
            name={"SOMA"}
            position={{ lat: this.props.lat, lng: this.props.long }}
          />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
          >
            <div>
              <h4 className="Font6 DarkBlue">
                {this.state.selectedPlace.title}
              </h4>
              <small>{this.props.mapping}</small>
            </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAlcxcqKMvLaE2t4eU7fFc8JwEpziDfZB8",
})(HutMap);
