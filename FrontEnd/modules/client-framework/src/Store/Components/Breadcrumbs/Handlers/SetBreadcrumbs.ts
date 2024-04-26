import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { LinkProps } from "@insite/mobius/Link";

type HandlerType = Handler<{ links: LinkProps[] | undefined }>;

export const DispatchSetLinks: HandlerType = props => {
    props.dispatch({
        type: "Components/Breadcrumbs/SetLinks",
        links: props.parameter.links,
    });
};

export const chain = [DispatchSetLinks];

const setBreadcrumbs = createHandlerChainRunner(chain, "SetBreadcrumbs");
export default setBreadcrumbs;
