import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { getUrl, setServerPageMetadata } from "@insite/client-framework/ServerSideRendering";
import { WebsiteSettingsModel } from "@insite/client-framework/Types/ApiModels";

export interface PreparedMetadata {
    metaDescription: string;
    metaKeywords: string;
    openGraphImage: string;
    openGraphTitle: string;
    openGraphUrl: string;
    canonicalUrl?: string;
    alternateLanguageUrls?: SafeDictionary<string>;
    title: string;
}

export interface Metadata {
    metaDescription?: string;
    metaKeywords?: string;
    openGraphImage?: string;
    openGraphTitle?: string;
    openGraphUrl?: string;
    currentPath: string;
    canonicalPath?: string;
    alternateLanguageUrls?: SafeDictionary<string>;
    title?: string;
    websiteName: string;
}

export default function setPageMetadata(
    {
        metaDescription,
        metaKeywords,
        openGraphImage,
        openGraphTitle,
        openGraphUrl,
        currentPath,
        canonicalPath,
        alternateLanguageUrls,
        title,
        websiteName,
    }: Metadata,
    websiteSettings?: WebsiteSettingsModel,
) {
    const url: { protocol: string; host: string } = IS_SERVER_SIDE ? getUrl()! : window.location;
    const authority = `${url.protocol}//${url.host}`;

    const cleanUrl = (url?: string, alternativeUrl = "") => {
        if (!url) {
            return alternativeUrl;
        }

        if (url.toLowerCase().startsWith("http")) {
            return url;
        }

        return `${authority}${url.startsWith("/") ? url : `/${url}`}`;
    };

    const cleanAlternateLanguageUrls = (alternateLanguageUrls?: SafeDictionary<string>) => {
        const languageUrls: { [key: string]: string } = {};
        alternateLanguageUrls &&
            Object.entries(alternateLanguageUrls).forEach(([key, value]) => {
                languageUrls[key] = cleanUrl(value);
            });

        return languageUrls;
    };

    const currentUrl = cleanUrl(currentPath);
    const actualTitle = generatePageTitle(title || "", websiteName, websiteSettings);
    const ogTitle = openGraphTitle || actualTitle || "";
    const ogImage = cleanUrl(openGraphImage);
    const ogUrl = cleanUrl(openGraphUrl, currentUrl);
    const canonicalUrl = cleanUrl(canonicalPath, currentUrl);
    const preparedAlternateLanguageUrls = cleanAlternateLanguageUrls(alternateLanguageUrls);

    if (IS_SERVER_SIDE) {
        setServerPageMetadata({
            metaDescription: metaDescription || "",
            metaKeywords: metaKeywords || "",
            openGraphUrl: ogUrl,
            openGraphTitle: ogTitle,
            openGraphImage: ogImage,
            canonicalUrl,
            alternateLanguageUrls: preparedAlternateLanguageUrls,
            title: actualTitle,
        });
    } else {
        document.title = actualTitle;
        document.getElementById("ogTitle")?.setAttribute("content", ogTitle);
        document.getElementById("ogImage")?.setAttribute("content", ogImage);
        document.getElementById("ogUrl")?.setAttribute("content", ogUrl);
        document.querySelector('meta[name="keywords"]')?.setAttribute("content", metaKeywords || "");
        document.querySelector('meta[name="description"]')?.setAttribute("content", metaDescription || "");
        document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonicalUrl || "");
        preparedAlternateLanguageUrls &&
            Object.entries(preparedAlternateLanguageUrls)?.forEach(([key, value]) => {
                document.querySelector(`link[rel="alternate"][hreflang="${key}"]`)?.setAttribute("href", value);
            });
    }
}

function generatePageTitle(title: string, websiteName: string, websiteSettings?: WebsiteSettingsModel) {
    if (!websiteSettings) {
        return websiteName + (title ? ` | ${title}` : "");
    }

    if (!websiteSettings.includeSiteNameInPageTitle) {
        return title;
    }

    return websiteSettings.siteNameAfterTitle
        ? `${title}${websiteSettings.pageTitleDelimiter}${websiteName}`
        : `${websiteName}${websiteSettings.pageTitleDelimiter}${title}`;
}
