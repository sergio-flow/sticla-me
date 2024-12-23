"use client"

import React, { useEffect, useCallback, useState } from 'react'
// import { GoogleMap, Marker, MarkerClusterer, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { APIProvider, Map, AdvancedMarker, Pin, Marker, useAdvancedMarkerRef, InfoWindow } from '@vis.gl/react-google-maps';
import styles from "./MainMap.module.css"
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import {
    setKey,
    setDefaults,
    setLanguage,
    setRegion,
    fromAddress,
    fromLatLng,
    fromPlaceId,
    setLocationType,
    geocode,
    RequestType,
} from "react-geocode";


const containerStyle = {
    overflow: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 2
};

const center = {
    lat: 46.7712,
    lng: 23.6236
};

const INITIAL_CAMERA = {
    center: center,
    zoom: 14
};

const apiKey = "AIzaSyDBo5jso7UAphik_z4r6xf_y07meX5n4qU"

setDefaults({
    key: apiKey, // Your API key here.
    language: "ro", // Default language for responses.
    region: "ro", // Default region for responses.
});

function MainMap() {
    const {
        placesService,
        placePredictions,
        getPlacePredictions,
        isPlacePredictionsLoading,
    } = usePlacesService({
        apiKey,
        options: {
            // types: ['route'],
            language: "ro",
            // locationRestriction: {
            //     lat: 46,
            //     lng: 23
            // },
            // types: ["Cluj"],
            componentRestrictions: { country: "ro" },
        },
    });

    const [cameraProps, setCameraProps] =
        useState(INITIAL_CAMERA);

    const handleCameraChange = useCallback((ev) => {
        // console.log(ev)
        setCameraProps(ev.detail)
    });

    const [markerRefs, setMarkerRefs] = useState([]);


    // `markerRef` and `marker` are needed to establish the connection between
    // the marker and infowindow (if you're using the Marker component, you
    // can use the `useMarkerRef` hook instead).
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [addressMarkerRef, addressMarker] = useAdvancedMarkerRef();
    const [currentLocation, setCurrentLocation] = useState(null);
    const [infoWindowShown, setInfoWindowShown] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [address, setAddress] = useState(null);
    const [addressRef, setAddressRef] = useState(null);
    const [thanks, setThanks] = useState(false);
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        // fetch place details for the first element in placePredictions array
        // if (placePredictions.length)
        //     placesService?.getDetails(
        //         {
        //             placeId: placePredictions[0].place_id,
        //         },
        //         (placeDetails) => savePlaceDetailsToState(placeDetails)
        //     );
        fetchMarkers()
    }, []);

    const fetchMarkers = async () => {
        const res = await fetch("/api/get-markers")

        const { markers } = await res.json()

        setMarkerRefs(markers.map(() => React.createRef()));
        setMarkers(markers)
    }

    const handleMarkerClick = (index) => {
        // Toggle the InfoWindow for the clicked marker
        if (infoWindowShown === index) {
            setInfoWindowShown(null); // Close if the same marker is clicked again
        } else {
            setInfoWindowShown(index); // Show the InfoWindow for the clicked marker
        }
    };

    const handleSuggestion = (item) => {
        setAddress(item)

        fromPlaceId(item.place_id)
            .then(({ results }) => {
                const { lat, lng } = results[0].geometry.location;

                setCurrentLocation({ lat, lng })
                setCameraProps({
                    center: { lat, lng }
                })
            })
            .catch(console.error);
    }

    const submitRequest = () => {
        setCurrentLocation(null)
        getPlacePredictions({ input: "" })
        setAddress(null)
        setThanks(true)
    }

    // if the maps api closes the infowindow, we have to synchronize our state
    const handleClose = useCallback(() => setInfoWindowShown(false), []);

    if (!showMap) {
        return <div className={styles.intro}>
            <h3>Disponibil in Cluj</h3>
            <h1>Venim la tine acasa si luam sticlele pentru reciclare</h1>
            <button onClick={() => setShowMap(true)}>Începe</button>
        </div>
    }

    return (
        <APIProvider apiKey={apiKey}>
            <Map
                mapId="google-map"
                style={containerStyle}
                // defaultCenter={center}
                // defaultZoom={14}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                options={{
                    styles: mapStyles,
                    fullscreenControl: false,
                    zoomControl: false,
                    streetViewControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                }}
                {...cameraProps}
                onCameraChanged={handleCameraChange}
            // zoom={14}
            // onLoad={onLoad}
            // onUnmount={onUnmount}
            >

                {currentLocation &&
                    <AdvancedMarker
                        ref={addressMarkerRef}
                        position={currentLocation}
                        onClick={() => false}
                        draggable={true}
                    >
                        <Pin
                            background={'#2196f3'}
                            borderColor={'#3f51b5'}
                            glyphColor={'#3f51b5'}
                        />
                    </AdvancedMarker>
                }

                {markers.map(({ lat, lng, name, address }, index) => (
                    <>
                        <AdvancedMarker
                            ref={markerRefs[index]}
                            position={{ lat, lng }}
                            onClick={() => handleMarkerClick(index)}
                        >
                            <Pin
                                background={'#65dc5f'}
                                borderColor={'#006425'}
                                glyphColor={'#006425'}
                            />
                        </AdvancedMarker>

                        {infoWindowShown === index && (
                            <InfoWindow anchor={markerRefs[index]?.current} className={styles.infoWindow} onClose={handleClose}>
                                {/* <img src="/pin.jpg" alt="" /> */}
                                <h2>{name} <span className={styles.status}>Disponibil</span></h2>
                                <p>{address}</p>
                                <p><b>Actualizat</b>: 3 ore în urmǎ</p>
                                <div className={styles.buttons}>
                                    <button className={styles.functional}>It's functional</button>
                                    <button className={styles.notFunctional}>Not functional</button>
                                </div>
                            </InfoWindow>
                        )}
                    </>
                ))}

                {thanks &&
                    <div className={styles.thanks}>
                        <h2>Va multumim!</h2>
                        <p>O persoana va va contacta in scurt timp.</p>
                        <button onClick={() => setThanks(false)}>Inchide</button>
                    </div>
                }

                {address &&
                    <>
                        <div
                            onClick={() => {
                                setAddress(null)
                                getPlacePredictions({ input: "" })
                            }}
                            className={styles.enteredAddress}>
                            <svg xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 463.95"><path fillRule="nonzero" d="M512 332.66H268.5v92.31c-.68 15.47-5.77 26.46-15.43 32.82-25.79 17.2-52.31-5.26-69.24-22.6L14.33 261.6c-19.11-17.28-19.11-41.93 0-59.21L188.71 24.42c16.06-16.39 40.56-34.09 64.36-18.21 9.66 6.35 14.75 17.34 15.43 32.81v92.31H512v201.33z" /></svg>

                            {address.description}
                        </div>

                        <div className={styles.form}>
                            <input
                                onChange={(evt) => {
                                    getPlacePredictions({ input: evt.target.value });
                                }} placeholder='Numarul tau de telefon *'
                            />
                            <button onClick={() => submitRequest()}>Vreau sa reciclez</button>
                        </div>
                    </>
                }

                {!address &&
                    <>
                        <div className={styles.suggestions}>
                            {placePredictions.map((item) => {
                                // console.log(item)
                                return (
                                    <div onClick={() => handleSuggestion(item)}>{item.description}</div>
                                )
                            })}
                        </div>

                        <div className={styles.form}>
                            <input
                                className={styles.enterAddress}
                                onChange={(evt) => {
                                    getPlacePredictions({ input: `${evt.target.value}, Cluj, Romania` });
                                }}
                                placeholder='Introdu adresa ta si venim la tine'
                            />
                            {/* <button>Vreau sa reciclez</button> */}
                        </div>
                    </>
                }
            </Map>
        </APIProvider>
    )
}

const mapStyles = [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#393939"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "all",
        "stylers": [
            {
                "saturation": "-100"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": "5"
            },
            {
                "gamma": "1.00"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
            {
                "saturation": "-100"
            },
            {
                "gamma": "0.90"
            },
            {
                "lightness": "0"
            }
        ]
    },
    {
        "featureType": "poi.school",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "saturation": "-100"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": "-100"
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": "0"
            },
            {
                "lightness": "-15"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [
            {
                "gamma": "0.63"
            },
            {
                "saturation": "40"
            },
            {
                "hue": "#97ff00"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels",
        "stylers": [
            {
                "saturation": "-100"
            },
            {
                "gamma": "0.90"
            },
            {
                "lightness": "0"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#9cd2dc"
            },
            {
                "visibility": "on"
            }
        ]
    }
]

export default React.memo(MainMap)