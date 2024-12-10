import { useEffect, useRef, useState } from 'react'
import './App.css'
import SceneView from "@arcgis/core/views/SceneView"
import Map from "@arcgis/core/Map"
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer"
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol"
import Graphic from "@arcgis/core/Graphic"
import Point from "@arcgis/core/geometry/Point"
import "./App.css"



function App() {
  const viewRef = useRef<HTMLDivElement>(null)
  const graphicsLayerRef = useRef<GraphicsLayer | null>(null);
  const viewRefInstance = useRef<SceneView | null>(null);
  const highlightRef = useRef<__esri.Handle | null>(null);
  const historicalPositionsLayerRef = useRef<GraphicsLayer | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [issData, setIssData] = useState<Array<{
    latitude: string | null;
    longitude: string | null;
    timestamp: string | null;
  }>>([]);

  const [, setSelectedPositionIndex] = useState<number | null>(null);

  const fetchIssPosition = async (signal?: AbortSignal) => {
    try {
      const response = await fetch("http://api.open-notify.org/iss-now.json", {
        signal
      });
      const data = await response.json();
      const { latitude, longitude } = data.iss_position;
      const timestamp = new Date(data.timestamp * 1000).toLocaleString();
      setIssData((prevData) => [
        ...prevData,
        { latitude, longitude, timestamp },
        //TODO: Annullare la chiamata se non viene completata entro tot secondi
      ])
    } catch (error) {
      console.error("Error fetching ISS position:", error);
    }
  };

  useEffect(() => {
    const viewEl = viewRef.current;
    if (!viewEl) return;

    const map = new Map({
      basemap: "streets-night-vector",
    });

    const view = new SceneView({
      container: viewEl,
      map: map,
      zoom: 4,
      center: [15, 65], 
      highlightOptions: {
        fillOpacity: 0.3
      }
    });

    viewRefInstance.current = view;

    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer)
    graphicsLayerRef.current = graphicsLayer;

    const issSymbol = new PictureMarkerSymbol({
      url: './iss.png',
      width: 30,
      height: 30,
      angle: 0,
    });

    const graphicIss = new Graphic({
      geometry: new Point(),
      symbol: issSymbol,
    });

    graphicsLayer.add(graphicIss);


    const historicalPositionsLayer = new GraphicsLayer();
    map.add(historicalPositionsLayer);
    historicalPositionsLayerRef.current = historicalPositionsLayer;

    const abortCall = new AbortController();
    fetchIssPosition(abortCall.signal);   
    
    const interval = setInterval(() => {
      fetchIssPosition();
    }, 10 * 1000);

    return () => {
      clearInterval(interval);
      abortCall.abort('aborted');
      view.set('container', null);
    };
  }, []);

  useEffect(() => {
    if (issData.length === 0 || !viewRefInstance.current) return;

    const lastPosition = issData[issData.length - 1];
    const { latitude, longitude } = lastPosition;

    const updatedPoint = new Point({
      longitude: parseFloat(longitude || '0'),
      latitude: parseFloat(latitude || '0'),
    });


    if (graphicsLayerRef.current) {
    const graphicIss = graphicsLayerRef.current.graphics.getItemAt(0);
      if (graphicIss) {
        graphicIss.geometry = updatedPoint;

        const view = viewRefInstance.current;
        if (view) {
/*           view.goTo({ center: updatedPoint, zoom: 8}); */
        }
      }
    }
  }, [issData])
  
  const handleHighlight = (index: number) => {
    setSelectedIndex(index);
    const view = viewRefInstance.current;
    const graphicsLayer = graphicsLayerRef.current;
    const historicalPositionsLayer = historicalPositionsLayerRef.current;


    if (highlightRef.current) {
      highlightRef.current.remove();
    }


    if (historicalPositionsLayer) {
      historicalPositionsLayer.removeAll();
    }

    if (view && graphicsLayer && historicalPositionsLayer) {
      const selectedPosition = issData[index];


      const historicalPoint = new Point({
        longitude: parseFloat(selectedPosition.longitude || '0'),
        latitude: parseFloat(selectedPosition.latitude || '0'),
      });

      const historicalSymbol = new PictureMarkerSymbol({
        url: './iss.png',
        width: 25,
        height: 25,
        angle: 0,
      });


      const historicalGraphic = new Graphic({
        geometry: historicalPoint,
        symbol: historicalSymbol
      });


      if (historicalPositionsLayer) {
        historicalPositionsLayer.add(historicalGraphic);
      }


      view.goTo({
        target: historicalPoint,
        zoom: 8
      });


      setSelectedPositionIndex(index);


      view.whenLayerView(historicalPositionsLayer).then((layerView) => {
        highlightRef.current = layerView.highlight(historicalGraphic);
      });
    }
  };


  return (
    <div className="app-container">
    <div className="sidebar">
    <h1>A S I D E</h1>
    <h2>ISS Positions' log</h2>
    <div className="log-container">
    <table className="iss-table">
      <thead>
        <tr>  
          <th>Latitude</th>
          <th>Longitude</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {
          issData.map((position, index) => (
            <tr key={index} onClick={() => handleHighlight(index)} className={selectedIndex === index ? 'selected' : ''} >
              <td>
                <img src="./iss.png" alt="Iss" className="iss-icon"/>
                {position.latitude}</td>
              <td>{position.longitude}</td>
              <td>{position.timestamp}</td>
            </tr>
          ))}
      </tbody>
    </table>
    </div>
    </div>
    <div ref={viewRef} className="map-container"/>
    </div>
  )
}

export default App
