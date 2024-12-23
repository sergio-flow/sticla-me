"use client"

import React, { useState } from "react"
import styles from "./Nav.module.css"
import usePlacesAutocompleteService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
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

const apiKey = "AIzaSyDBo5jso7UAphik_z4r6xf_y07meX5n4qU"

const Nav = () => {
    const [addNewPoint, setAddNewPoint] = useState(false)
    const [contactUs, setContactUs] = useState(false)
    const [pointAdded, setPointAdded] = useState(false)
    const [messageSent, setMessageSent] = useState(false)
    const [locationName, setLocationName] = useState("")
    const [locationAddress, setLocationAddress] = useState("")
    const [locationLat, setLocationLat] = useState("")
    const [locationLng, setLocationLng] = useState("")
    const [locationImage, setLocationImage] = useState("")

    const {
        placesService,
        placePredictions,
        getPlacePredictions,
        isPlacePredictionsLoading,
    } = usePlacesAutocompleteService({
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

    const handleSuggestion = async (item) => {
        getPlacePredictions({ input: `` });

        fromPlaceId(item.place_id)
            .then(({ results }) => {
                const { lat, lng } = results[0].geometry.location;

                setLocationLat(lat)
                setLocationLng(lng)
                setLocationAddress(item.description)
            })
            .catch(console.error);
    }

    const handleAddPoint = async () => {
        const object = {
            name: locationName,
            address: locationAddress,
            lat: locationLat,
            lng: locationLng
        }

        const response = await fetch("/api/add-marker", {
            method: "POST",
            body: JSON.stringify({ marker: object }),
        });

        const resJson = await response.json()

        console.log(resJson)
    }

    return (
        <>
            <button onClick={() => setAddNewPoint(p => !p)} className={`${styles.button} ${styles.addPoint}`}>
                <svg fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.77,9.35A2.52,2.52,0,0,1,14,7.59V3a1,1,0,0,0-1-1H11a1,1,0,0,0-1,1V7.59a2.52,2.52,0,0,1-.77,1.76A4.41,4.41,0,0,0,8,12.41V20a2,2,0,0,0,2,2h4a2,2,0,0,0,2-2V12.41A4.41,4.41,0,0,0,14.77,9.35Z" />
                </svg>
                + Adauga punct de reciclare
            </button>

            <button onClick={() => setContactUs(p => !p)} className={`${styles.button} ${styles.contactUs}`}>
                <svg fill="#000000" height="800px" width="800px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" xmlSpace="preserve">
                    <path d="M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14S23.7,2,16,2z M20,11c1.7,0,3,1.3,3,3c0,0.6-0.4,1-1,1s-1-0.4-1-1
	c0-0.6-0.4-1-1-1s-1,0.4-1,1c0,0.6-0.4,1-1,1s-1-0.4-1-1C17,12.3,18.3,11,20,11z M12,11c1.7,0,3,1.3,3,3c0,0.6-0.4,1-1,1s-1-0.4-1-1
	c0-0.6-0.4-1-1-1s-1,0.4-1,1c0,0.6-0.4,1-1,1s-1-0.4-1-1C9,12.3,10.3,11,12,11z M16,25c-4.4,0-8-3.6-8-8c0-0.1,0-0.2,0-0.3
	c0-0.3,0.2-0.7,0.5-0.9c0.3-0.2,0.6-0.3,0.9-0.1c1.9,0.8,4.2,1.2,6.6,1.2s4.7-0.4,6.6-1.2c0.3-0.1,0.6-0.1,0.9,0.1
	c0.3,0.2,0.4,0.5,0.5,0.8c0,0.2,0,0.3,0,0.4C24,21.4,20.4,25,16,25z"/>
                </svg>
                Contacteaza-ne
            </button>

            {addNewPoint &&
                <div className={styles.modalForm}>
                    <h2>Adauga un punct nou de reciclare</h2>
                    <form>
                        <input
                            type="text"
                            value={locationName}
                            onChange={e => setLocationName(e.target.value)}
                            placeholder="Nume locatie, ex: Profi, Mega Image"
                        />
                        <div className={styles.address}>
                            <input
                                type="text"
                                value={locationAddress}
                                onChange={evt => {
                                    getPlacePredictions({ input: `${evt.target.value}, Cluj, Romania` });
                                    setLocationAddress(evt.target.value)
                                    setLocationLat("")
                                    setLocationLng("")
                                }}
                                placeholder="Adresa locatiei"
                            />

                            <div className={styles.suggestions}>
                                {placePredictions.map((item) => {
                                    // console.log(item)
                                    return (
                                        <div onClick={() => handleSuggestion(item)}>{item.description}</div>
                                    )
                                })}
                            </div>
                        </div>

                    </form>
                    <button disabled={!locationLat || !locationLng || !locationAddress || !locationName} onClick={() => {
                        setPointAdded(true)
                        setAddNewPoint(p => !p)
                        handleAddPoint()
                    }}>Adauga</button>
                    <button onClick={() => setAddNewPoint(p => !p)} className={styles.close}>
                        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.5" d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="#1C274C" strokeWidth="1.5" />
                            <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
            }

            {contactUs &&
                <div className={styles.modalForm}>
                    <h2>Contacteaza-ne</h2>
                    <form>
                        <input type="text" placeholder="Nume" />
                        <input type="text" placeholder="Email" />

                        <textarea placeholder="Mesaj" />
                    </form>
                    <button onClick={() => {
                        setMessageSent(true)
                        setContactUs(p => !p)
                    }}>Trimite</button>
                    <button onClick={() => setContactUs(p => !p)} className={styles.close}>
                        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.5" d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="#1C274C" strokeWidth="1.5" />
                            <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
            }
        </>
    )
}

export default Nav