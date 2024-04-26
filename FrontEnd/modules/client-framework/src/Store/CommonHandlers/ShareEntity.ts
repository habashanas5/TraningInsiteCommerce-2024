import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import {
    shareEntity as shareEntityApi,
    ShareEntityApiParameter,
    shareEntityGenerateFromWebpage,
} from "@insite/client-framework/Services/EmailService";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { ShareEntityModel } from "@insite/client-framework/Types/ApiModels";

export interface ShareEntityParameter {
    shareEntityModel: ShareEntityModel;
    url: string;
    onSuccess?: () => void;
    generateAttachmentFromWebpage?: boolean;
}

type HandlerType = ApiHandlerDiscreteParameter<ShareEntityParameter, ShareEntityApiParameter, ShareEntityModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        shareEntityModel: props.parameter.shareEntityModel,
        url: props.parameter.url,
    };
};

export const SendDataToApi: HandlerType = async props => {
    const {
        parameter: { generateAttachmentFromWebpage },
        apiParameter,
    } = props;
    const location = getLocation(props.getState());
    props.apiResult = generateAttachmentFromWebpage
        ? await shareEntityGenerateFromWebpage({
              shareEntityModel: props.parameter.shareEntityModel,
              urlPathToLoadForAttachmentHtml: location.pathname + location.search,
          })
        : await shareEntityApi(apiParameter);
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.();
};

export const chain = [PopulateApiParameter, SendDataToApi, ExecuteOnSuccessCallback];

const shareEntity = createHandlerChainRunner(chain, "ShareEntity");
export default shareEntity;
