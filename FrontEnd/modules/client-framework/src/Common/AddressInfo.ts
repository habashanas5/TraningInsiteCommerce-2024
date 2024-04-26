export default interface AddressInfo {
    firstName: string;
    lastName: string;
    companyName: string;
    attention: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    city: string;
    state?: string;
    stateId?: string;
    postalCode: string;
    country?: string;
    countryId?: string;
    phone: string;
    fax: string;
    email: string;
}
