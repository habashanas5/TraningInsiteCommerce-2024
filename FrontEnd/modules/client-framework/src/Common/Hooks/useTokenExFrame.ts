import { WebsiteSettingsModel } from "@insite/client-framework/Types/ApiModels";
import { useEffect } from "react";

export const useTokenExFrame = (websiteSettings: WebsiteSettingsModel) => {
    useEffect(() => {
        if (websiteSettings.useTokenExGateway || websiteSettings.useECheckTokenExGateway) {
            const script = document.createElement("script");
            script.src = websiteSettings.tokenExTestMode
                ? "https://test-htp.tokenex.com/Iframe/Iframe-v3.min.js"
                : "https://htp.tokenex.com/Iframe/Iframe-v3.min.js";
            script.async = true;

            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
    }, []);
};
