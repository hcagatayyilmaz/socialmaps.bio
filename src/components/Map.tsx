"use client"

import React, {useState, useEffect} from "react"
import {GoogleMap, LoadScript, Marker, InfoWindow} from "@react-google-maps/api"
import {style} from "@/lib/map"

const containerStyle = {
  width: "100%",
  height: "33vh"
}

// Fallback default center
const fallbackCenter = {lat: 40.712776, lng: -74.005974}

export default function SocialMap(props: any) {
  const options = {
    styles: style
  }

  const {locations} = props
  const [activeMarker, setActiveMarker] = useState(null)
  const [map, setMap] = useState(null)

  // Compute the default center based on the first location
  const defaultCenter =
    locations.length > 0
      ? {lat: locations[0].lat, lng: locations[0].lng}
      : fallbackCenter

  useEffect(() => {
    if (map && locations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      locations.forEach((location) => {
        bounds.extend(new window.google.maps.LatLng(location.lat, location.lng))
      })
      map.fitBounds(bounds)
    }
  }, [map, locations])

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return
    }
    setActiveMarker(marker)
  }

  const handleLoad = (mapInstance) => {
    setMap(mapInstance)
  }

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        options={{options}}
        center={defaultCenter}
        zoom={20}
        onLoad={handleLoad}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={{lat: location.lat, lng: location.lng}}
            onClick={() => handleActiveMarker(index)}
          >
            {activeMarker === index && (
              <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                <div>{location.description}</div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </LoadScript>
  )
}
