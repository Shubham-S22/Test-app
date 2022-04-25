// import logo from './logo.svg';
// import './App.css';
// jQuery
import React from "react";
import $, { event } from "jquery";
// Esri
import Graphic from "@arcgis/core/Graphic";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Zoom from "@arcgis/core/widgets/Zoom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.alpha = {
      view: null,
      lat: null,
      long: null,
      pointGraphic: null,
    };
    this.textChangeHandler = this.textChangeHandler.bind(this);
    this.btnClick = this.btnClick.bind(this);
    this.mapClick = this.mapClick.bind(this);
    this.addGraphic = this.addGraphic.bind(this);
  }

  componentDidMount() {
    ///create map
    const map = new Map({
      basemap: "streets-vector",
      // basemap: "satellite",
      // basemap: "hybrid",
      // basemap: "arcgis-imagery",
    });

    let view = new MapView({
      map: map,
      container: "map",
      zoom: 2,
    });

    view.on("click", this.mapClick);

    this.setState({ view: view });
  }

  textChangeHandler(evt) {
    this.setState({ [evt.target.name]: evt.target.value });

    console.log(evt.target.name, evt.target.value);
  }

  render() {
    return (
      <div id="mainDiv">
        <table>
          <tr>
            <td className="sliceLeft">
              <div id="map"></div>
            </td>
            <td className="sliceRight">
              <div>
                <table>
                  {/* Lat */}
                  <tr>
                    <th>Lat</th>
                    <td>
                      <input
                        id="latVal"
                        name="lat"
                        value={this.state.lat}
                        onChange={this.textChangeHandler}
                      />
                    </td>
                  </tr>

                  {/* Long */}
                  <tr>
                    <th>Long</th>
                    <td>
                      <input
                        id="longVal"
                        name="long"
                        value={this.state.long}
                        onChange={this.textChangeHandler}
                      />
                    </td>
                  </tr>

                  {/* Button */}
                  <tr>
                    <td colSpan={2}>
                      <button id="btn" onClick={this.btnClick}>
                        Search
                      </button>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </table>
      </div>
    );
  }

  btnClick() {
    let lat = parseFloat(this.state.lat);
    let long = parseFloat(this.state.long);
    console.log(lat, long);

    this.state.view.goTo({
      center: [long, lat],
      zoom: 5,
    });

    this.addGraphic(lat, long);
  }

  mapClick(evt) {
    console.log(evt.mapPoint);
    let lat = evt.mapPoint.latitude;
    this.setState({ lat: lat });
    let long = evt.mapPoint.longitude;
    this.setState({ long: long });

    $("#latVal").val(lat);
    $("#longVal").val(long);

    this.addGraphic(lat, long);
  }

  addGraphic(lat, long) {
    //Remove old graphic if any
    this.state.view.graphics.remove(this.state.pointGraphic);

    // First create a point geometry
    let point = {
      type: "point", // autocasts as new Point()
      longitude: parseFloat(long),
      latitude: parseFloat(lat),
    };

    // Create a symbol for drawing the point
    let markerSymbol = {
      type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
      color: [226, 119, 40],
    };

    // Create a graphic and add the geometry and symbol to it
    let pointGraphic = new Graphic({
      geometry: point,
      symbol: markerSymbol,
    });

    this.state.view.graphics.add(pointGraphic);
    this.setState({ pointGraphic: pointGraphic });
  }
}

export default App;

// testing
