import { getGeoLocation } from "@insite/client-framework/Common/Utilities/GoogleMaps/getGeoLocation";
import * as React from "react";

interface Props {
    isShown: boolean;
    isLoaded?: boolean;
}

/**
 * Helps manage loading google map scripts.
 * This will track the current location and manage a Google Map.
 * @param props
 */
const useGoogleMaps = ({ isShown, isLoaded }: Props) => {
    const [currentLocation, setCurrentLocation] = React.useState<google.maps.LatLng | undefined>(undefined);
    const [locationKnown, setLocationKnown] = React.useState<boolean>(false);
    const [googleMap, setGoogleMap] = React.useState<google.maps.Map | undefined>(undefined);

    const setMapCenter = (center: google.maps.LatLng) => {
        googleMap?.setCenter(center);
    };

    // Take in points and set the Google Map to that bounding area.
    const setBounds = (points: { lat: number; lng: number }[]) => {
        if (!googleMap) {
            return;
        }
        const bounds = new google.maps.LatLngBounds();
        points.forEach(point => {
            bounds.extend(point);
        });

        // Extends the bounds when we have only one marker to prevent zooming in too far.
        if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
            const extendPoint1 = new google.maps.LatLng(
                bounds.getNorthEast().lat() + 0.03,
                bounds.getNorthEast().lng() + 0.03,
            );
            const extendPoint2 = new google.maps.LatLng(
                bounds.getNorthEast().lat() - 0.03,
                bounds.getNorthEast().lng() - 0.03,
            );
            bounds.extend(extendPoint1);
            bounds.extend(extendPoint2);
        }

        if (bounds.getCenter().lat() === 0 && bounds.getCenter().lng() === -180) {
            return;
        }

        googleMap.setCenter(bounds.getCenter());
        googleMap.fitBounds(bounds);
    };

    // Manage Map Center on Scripts Loaded
    React.useEffect(() => {
        if (!isShown || !isLoaded) {
            return;
        }
        getGeoLocation(new google.maps.LatLng(0, 0)).then(result => {
            setCurrentLocation(result);
        });
    }, [isShown, isLoaded]);

    // Set state of Location Known, from current location and not already true.
    React.useEffect(() => {
        if (currentLocation && !locationKnown) {
            setLocationKnown(true);
        }
    }, [currentLocation]);

    return {
        googleMap,
        isGoogleMapsScriptsLoaded: isLoaded,
        currentLocation,
        setCurrentLocation,
        locationKnown,
        setLocationKnown,
        setGoogleMap,
        setBounds,
        setMapCenter,
    };
};

export default useGoogleMaps;
