import { useEffect, useRef } from 'react'
import './App.css'
import MapView from "@arcgis/core/views/MapView"
import Map from "@arcgis/core/Map"


function App() {
  const viewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const viewEl = viewRef.current 
    if(!viewEl) return; 
    const map = new Map({
      basemap: "topo-vector"
    }); 

    const view = new MapView({
      container: viewEl, 
      map: map,
      zoom: 4,
      center: [15, 65] 
    });
  })

  return (
    <div ref={viewRef} style={{height: "100%"}}/>
  )
}

export default App
