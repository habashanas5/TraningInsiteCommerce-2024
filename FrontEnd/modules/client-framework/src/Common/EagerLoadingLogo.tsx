import { createContext, useContext } from "react";

export const EagerLoadingLogoContext = createContext(false);

export const EagerLoadingLogoProvider = EagerLoadingLogoContext.Provider;

export const useEagerLogoLoading = () => {
    return useContext(EagerLoadingLogoContext);
};
