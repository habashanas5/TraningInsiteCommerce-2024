import * as React from "react";

interface Props<M extends LocationModel, P extends GetLocationsApiParameter> {
    onSearch: (searchFilter: string) => void;
    loadLocations: (parameters: P) => void;
    currentLocation?: google.maps.LatLng;
    defaultRadius: number;
    selectedLocation?: M;
    setSelectedLocation: (location: M) => void;
    setShowSelectedLocation: (show: boolean) => void;
    createFilter: (coords: google.maps.LatLng, searchFilter: string) => P;
}

export interface LocationModel {
    id: string;
    latitude: number;
    longitude: number;
    distance: number;
    hours?: string;
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    phone?: string;
    htmlContent?: string;
}

export interface GetLocationsApiParameter {
    latitude: number;
    longitude: number;
}

/**
 * This will track Search details for Locations, and search triggering.
 * @param props
 */
const useLocationFilterSearch = <M extends LocationModel, P extends GetLocationsApiParameter>({
    onSearch,
    loadLocations,
    defaultRadius,
    currentLocation,
    selectedLocation,
    setSelectedLocation,
    setShowSelectedLocation,
    createFilter,
}: Props<M, P>) => {
    const [filter, setFilter] = React.useState<P | undefined>(undefined);
    const [locationSearchFilter, setLocationSearchFilter] = React.useState<string>("");
    const [page, setPage] = React.useState<number>(1);
    const [pageSize, setPageSize] = React.useState<number | undefined>(undefined);

    // When the filter changes trigger loadLocations action.
    React.useEffect(() => {
        if (!filter) {
            return;
        }
        loadLocations(filter);
    }, [filter]);

    // Create a new filter when theses change
    React.useEffect(() => {
        if (!currentLocation) {
            return;
        }
        setFilter(createFilter(currentLocation, locationSearchFilter.trim()));
    }, [currentLocation, page, pageSize]);

    // Re-evaluate the Selected Location distance and show details.
    React.useEffect(() => {
        if (!filter || !selectedLocation) {
            return;
        }
        const distanceToSelectedLocation = getDistance(
            filter.latitude,
            filter.longitude,
            selectedLocation.latitude,
            selectedLocation.longitude,
        );
        const showSelectedLocation = distanceToSelectedLocation < defaultRadius;
        setShowSelectedLocation(showSelectedLocation);
        if (showSelectedLocation && distanceToSelectedLocation !== selectedLocation.distance) {
            setSelectedLocation({
                ...selectedLocation,
                distance: distanceToSelectedLocation,
            });
        }
    }, [filter, selectedLocation, defaultRadius]);

    // Search for known Location data
    const doSearch = (searchFilter: string) => {
        onSearch(searchFilter);
        if (currentLocation) {
            setFilter(createFilter(currentLocation, searchFilter.trim()));
        }
    };

    return {
        doSearch,
        locationSearchFilter,
        setLocationSearchFilter,
        page,
        setPage,
        pageSize,
        setPageSize,
    };
};

const getDistance = (latitude1: number, longitude1: number, latitude2: number, longitude2: number) => {
    let distance =
        Math.cos(getRadians(latitude1)) *
            Math.cos(getRadians(latitude2)) *
            Math.cos(getRadians(longitude2) - getRadians(longitude1)) +
        Math.sin(getRadians(latitude1)) * Math.sin(getRadians(latitude2));
    if (distance > 1) {
        distance = 1;
    }

    distance = 3960 * Math.acos(distance);

    return distance;
};

const getRadians = (degrees: number) => {
    return degrees * (Math.PI / 180);
};

export default useLocationFilterSearch;
