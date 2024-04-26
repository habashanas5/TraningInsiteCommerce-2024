(global as any).IS_SERVER_SIDE = false;

import { Session } from "@insite/client-framework/Services/SessionService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentUserIsGuest, getIsPunchOutSession } from "@insite/client-framework/Store/Context/ContextSelectors";
import ContextState from "@insite/client-framework/Store/Context/ContextState";

describe("getCurrentUserIsGuest selector", () => {
    let isAuthenticated = false;
    let isGuest = false;
    let punchOutSessionId: string | undefined;
    let userName: string;

    const initializeState = () => {
        return {
            context: {
                session: {
                    isAuthenticated,
                    isGuest,
                    userName,
                } as Session,
                punchOutSessionId,
            } as ContextState,
        } as ApplicationState;
    };

    test("should return true when authenticated as guest", () => {
        isAuthenticated = true;
        isGuest = true;
        const state = initializeState();

        const actualIsGuest = getCurrentUserIsGuest(state);

        expect(actualIsGuest).toBe(true);
    });

    test("should return false when not authenticated", () => {
        isAuthenticated = false;
        const state = initializeState();

        const actualIsGuest = getCurrentUserIsGuest(state);

        expect(actualIsGuest).toBe(false);
    });

    test("should return false when authenticated, but not guest", () => {
        isAuthenticated = true;
        isGuest = false;
        const state = initializeState();

        const actualIsGuest = getCurrentUserIsGuest(state);

        expect(actualIsGuest).toBe(false);
    });

    test("should return isPunchOutSession false by default", () => {
        const state = initializeState();

        const actualIsPunchOutSession = getIsPunchOutSession(state);

        expect(actualIsPunchOutSession).toBe(false);
    });

    test("should return isPunchOutSession true when punchOutSessionId and userName are set", () => {
        punchOutSessionId = "someId";
        userName = "somebody";
        const state = initializeState();

        const actualIsPunchOutSession = getIsPunchOutSession(state);

        expect(actualIsPunchOutSession).toBe(true);
    });
});
