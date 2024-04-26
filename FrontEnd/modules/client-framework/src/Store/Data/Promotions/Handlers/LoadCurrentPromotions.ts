/* eslint-disable spire/export-chain */
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import loadPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadPromotions";

const currentPromotionsParameter = Object.freeze({
    cartId: API_URL_CURRENT_FRAGMENT,
});

const loadCurrentPromotions = () => loadPromotions(currentPromotionsParameter);
export default loadCurrentPromotions;
