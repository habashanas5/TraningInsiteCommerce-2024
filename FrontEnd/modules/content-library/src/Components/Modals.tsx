/* eslint-disable spire/export-styles */
import AddToListModal from "@insite/content-library/Components/AddToListModal";
import ManageShareListModal from "@insite/content-library/Components/ManageShareListModal";
import ProductDeliveryScheduleModal from "@insite/content-library/Components/ProductDeliveryScheduleModal";
import ProductSelectorVariantModal from "@insite/content-library/Components/ProductSelectorVariantModal";
import ShareListModal from "@insite/content-library/Components/ShareListModal";
import * as React from "react";

const Modals = () => (
    <>
        <AddToListModal />
        <ShareListModal />
        <ManageShareListModal />
        <ProductSelectorVariantModal />
        <ProductDeliveryScheduleModal />
    </>
);

export default Modals;
