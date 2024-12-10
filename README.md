# React + TypeScript + Vite

## Description

A TypeScript-based app using ArcGIS to display a 3D map showing the real-time position of the International Space Station (ISS) every 10 seconds. The app logs each position in a sidebar and displays the current location of the ISS on the map. When a user clicks on a historical record, the map zooms to that position and highlights it.

### Key Features:
- **Real-Time ISS Positioning**: Displays the position of the ISS on a 3D map every 10 seconds.
- **Position Logging**: Logs each position with latitude, longitude, and timestamp in a sidebar.
- **Historical Positioning**: Clicking a record in the sidebar zooms to and highlights the corresponding position on the map.
- **Custom Marker Symbol**: Uses a custom image to represent the ISS on the map.
- **Highlighting Feature**: Highlights historical ISS positions when selected.

### Key Methods and Concepts Used:
- **SceneView**: Renders a 3D map to display the ISS's position.
- **Map**: Initializes the map with a `topo-vector` basemap.
- **GraphicsLayer**: Used to display the ISS position and historical positions on the map.
- **PictureMarkerSymbol**: Custom symbol for representing the ISS using an image.
- **Graphic**: Adds the ISS position and historical data as graphical elements on the map.
- **Point**: Creates geographic points for the ISS position and historical locations.
- **setInterval**: Periodically fetches the ISS position every 10 seconds.
- **AbortController**: Prevents duplicate API calls by aborting the previous request before making a new one.
- **goTo()**: Zooms the map to a specific historical position when selected.
- **highlight()**: Highlights the selected historical position on the map.
- **removeAll()**: Clears the historical positions before adding the selected one.
- **remove()**: Removes the previous highlight when a new position is selected.

### Disclaimer:
This app is intended purely for educational and practice purposes. It is not meant for real-world use or production environments. The functionality and performance may not be suitable for real-time or large-scale applications.
