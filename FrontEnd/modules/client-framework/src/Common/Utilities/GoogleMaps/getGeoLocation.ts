export const getGeoLocation = (defaultLocation: google.maps.LatLng) =>
    new Promise<google.maps.LatLng>((resolve, _) => {
        if (!navigator.geolocation) {
            return resolve(defaultLocation);
        }

        navigator.geolocation.getCurrentPosition(
            (position: Position) => {
                resolve(
                    new google.maps.LatLng(
                        parseFloat(`${position.coords.latitude}`),
                        parseFloat(`${position.coords.longitude}`),
                    ),
                );
            },
            (_: any) => {
                resolve(defaultLocation);
            },
            { timeout: 5500 },
        );
    });
