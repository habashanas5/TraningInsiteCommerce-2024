import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getAddressFieldsDataView } from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsSelector";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";
import translate from "@insite/client-framework/Translate";
import { ShipToModel } from "@insite/client-framework/Types/ApiModels";
import CustomerAddressForm, { CustomerAddressFormStyles } from "@insite/content-library/Components/CustomerAddressForm";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import React, { useState } from "react";
import { connect } from "react-redux";

interface OwnProps {
    newAddress: ShipToModel;
    isModalOpen: boolean;
    onModalClose: () => void;
    onFormSubmit: (event: React.FormEvent<HTMLFormElement>, newAddress: ShipToModel) => void;
    extendedStyles?: EditExistingAddressModalStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    countries: getCurrentCountries(state),
    shipToAddressFields: getAddressFieldsDataView(state).value?.shipToAddressFields,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export interface EditExistingAddressModalStyles {
    modal?: ModalPresentationProps;
    form?: CustomerAddressFormStyles;
}

export const createNewAddressModalStyles: EditExistingAddressModalStyles = {};

const EditExistingAddressModal = ({
    newAddress,
    isModalOpen,
    onModalClose,
    onFormSubmit,
    extendedStyles,
    countries,
    shipToAddressFields,
}: Props) => {
    if (!countries || !shipToAddressFields) {
        return null;
    }

    const [styles] = useState(() => mergeToNew(createNewAddressModalStyles, extendedStyles));

    return (
        <Modal
            {...styles.modal}
            headline={translate("Edit Address")}
            isOpen={isModalOpen}
            handleClose={onModalClose}
            data-test-selector="checkoutShipping_editAddressModal"
        >
            <CustomerAddressForm
                address={newAddress}
                countries={countries}
                addressFieldDisplayCollection={shipToAddressFields}
                onSubmit={onFormSubmit}
                saveButtonTextOverride={translate("Save & Apply")}
                onCancel={onModalClose}
                extendedStyles={styles.form}
            />
        </Modal>
    );
};

export default connect(mapStateToProps)(EditExistingAddressModal);
