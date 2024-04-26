import { LocationModel } from "@insite/client-framework/Common/Hooks/useLocationFilterSearch";
import { PaginationModel } from "@insite/client-framework/Types/ApiModels";
import React from "react";

interface Props<M extends LocationModel> {
    locations: M[];
    locationSearchFilter: string;
    locationsPagination?: PaginationModel;
    currentLocation?: google.maps.LatLng;
    selectedLocation?: M;
    showSelectedLocation: boolean;
    locationType?: "WAREHOUSE" | "LOCATION";
    setLocationOfInfoWindow: (location: M | undefined) => void;
    setCurrentLocationInfoWindow: (currentLocation: CurrentLocationInfoWindow | undefined) => void;
}

export interface LocationInfoWindow<M extends LocationModel> {
    position: google.maps.LatLng;
    location: M;
}
export interface CurrentLocationInfoWindow {
    position: google.maps.LatLng;
}
export interface LocationGoogleMapsMarker {
    key: string;
    locationId?: string;
    position: google.maps.LatLng;
    type: LocationGoogleMapMarkerType;
    icon: string;
    onClick: () => void;
}

export type LocationGoogleMapMarkerType = "WAREHOUSE" | "LOCATION" | "SELECTED" | "CURRENT_LOCATION";

/**
 * Manages the Google Markers for the passed in locations and InfoWindows for a Google Map.
 * @param props
 */
const useLocationGoogleMarkers = <M extends LocationModel>({
    locations,
    locationSearchFilter,
    locationsPagination,
    currentLocation,
    selectedLocation,
    showSelectedLocation,
    locationType,
    setLocationOfInfoWindow,
    setCurrentLocationInfoWindow,
}: Props<M>) => {
    const [mapMarkersElements, setMapMarkersElements] = React.useState<LocationGoogleMapsMarker[]>([]);

    const createMarkerClickHandler = (location: M) => {
        return () => {
            setCurrentLocationInfoWindow(undefined);
            setLocationOfInfoWindow(location);
        };
    };

    const createCurrentLocationMarkerClickHandler = () => {
        if (currentLocation) {
            setCurrentLocationInfoWindow({ position: currentLocation });
        }
        setLocationOfInfoWindow(undefined);
    };

    const getLocationNumber = (index: number): number => {
        if (!locationsPagination) {
            return 0;
        }
        const pageSize = locationsPagination.pageSize;
        const page = locationsPagination.page;
        return index + 1 + pageSize * (page - 1);
    };

    const clearLocationGoogleMarkers = () => {
        setMapMarkersElements([]);
        closeInfoWindows();
    };

    const closeInfoWindows = () => {
        setLocationOfInfoWindow(undefined);
        setCurrentLocationInfoWindow(undefined);
    };

    // From warehouses create Google Markers that can be shown on Google Map.
    React.useEffect(() => {
        const markers: LocationGoogleMapsMarker[] = locations.map((location, index) => ({
            key: location.id,
            locationId: location.id,
            position: new google.maps.LatLng(location.latitude, location.longitude),
            type: locationType || "LOCATION",
            icon: `https://mt.google.com/vt/icon/text=${getLocationNumber(
                index,
            )}&psize=16&color=ff330000&name=icons/spotlight/spotlight-waypoint-b.png&ax=44&ay=48&scale=1`,
            onClick: createMarkerClickHandler(location),
        }));
        // Add Selected Location Marker
        if (showSelectedLocation && selectedLocation) {
            markers.push({
                key: "selected",
                position: new google.maps.LatLng(selectedLocation.latitude, selectedLocation.longitude),
                type: "SELECTED",
                icon: "https://mt.google.com/vt/icon?name=icons/spotlight/spotlight-waypoint-blue.png",
                onClick: createMarkerClickHandler(selectedLocation),
            });
        }
        // Add Current/Search Location Marker
        if (currentLocation && currentLocation.lat() !== 0 && currentLocation.lng() !== 0) {
            markers.push({
                key: "current-location",
                position: currentLocation,
                type: "CURRENT_LOCATION",
                icon: "https://www.gstatic.com/images/icons/material/system_gm/2x/place_gm_blue_24dp.png",
                onClick: createCurrentLocationMarkerClickHandler,
            });
        }
        setMapMarkersElements(markers);
    }, [
        locations,
        currentLocation,
        locationSearchFilter,
        locationsPagination,
        selectedLocation,
        showSelectedLocation,
        locationType,
    ]);

    return {
        mapMarkersElements,
        clearLocationGoogleMarkers,
        closeInfoWindows,
        getLocationNumber,
    };
};

export default useLocationGoogleMarkers;
