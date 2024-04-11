"use client"

import {useState, useEffect} from "react"
import {GoogleMap, LoadScript, Marker, InfoWindow} from "@react-google-maps/api"
import {style} from "@/lib/map"

const containerStyle = {
    width: "100%",
    height: "100%"
}

const mockLocations = [
    {lat: 40.748817, lng: -73.985428, description: "Empire State Building"},
    {lat: 40.706001, lng: -74.008801, description: "One World Trade Center"},
    {lat: 40.712742, lng: -74.013382, description: "Battery Park"}
]

const fallbackCenter = {lat: 40.712776, lng: -74.005974}

export default function SocialMap(props: any) {
    const options = {
        styles: style
    }

    const {locations = mockLocations} = props
    const [activeMarker, setActiveMarker] = useState(null)
    const [map, setMap] = useState(null)

    // Compute the default center based on the first location
    const defaultCenter =
        locations.length > 0 ? {lat: locations[0].lat, lng: locations[0].lng} : fallbackCenter

    useEffect(() => {
        if (map && locations.length > 0) {
            const bounds = new window.google.maps.LatLngBounds()
            locations.forEach((location: any) => {
                if (
                    location &&
                    typeof location.lat === "number" &&
                    typeof location.lng === "number"
                ) {
                    bounds.extend(new window.google.maps.LatLng(location.lat, location.lng))
                } else {
                    console.error("Invalid location object:", location)
                }
            })
            map.fitBounds(bounds)
        }
    }, [map, locations])

    const handleActiveMarker = (marker: any) => {
        if (marker === activeMarker) {
            return
        }
        setActiveMarker(marker)
    }

    const handleLoad = (mapInstance: any) => {
        setMap(mapInstance)
    }

    return (
        <div className='w-full h-full'>
            <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
                libraries={["places"]}
            >
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    options={options}
                    center={defaultCenter}
                    zoom={20}
                    onLoad={handleLoad}
                >
                    {locations.map((location: any, index: number) => (
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
        </div>
    )
}
