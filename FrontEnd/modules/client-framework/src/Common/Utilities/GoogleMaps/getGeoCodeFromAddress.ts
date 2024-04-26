export const getGeoCodeFromAddress = (address: string) =>
    new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        if (address && address.trim()) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address }, (results: google.maps.GeocoderResult[], status: any) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    resolve(results);
                } else {
                    reject(status);
                }
            });
        } else {
            reject(google.maps.GeocoderStatus.ZERO_RESULTS);
        }
    });

export const getGeoCodeFromLatLng = (lat: number, lng: number) =>
    new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        const location = new google.maps.LatLng(lat, lng);
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: "", location }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                resolve(results);
            } else {
                reject(status);
            }
        });
    });
