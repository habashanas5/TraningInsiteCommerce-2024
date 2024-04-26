import { useEffect, useRef } from "react";

const useRecursiveTimeout = (callback: (() => Promise<void>) | (() => void), delay: number) => {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!delay) {
            return;
        }

        let timeoutId: number;
        const tick = () => {
            const result = savedCallback.current();

            if (result instanceof Promise) {
                result.then(() => {
                    if (delay) {
                        requestAnimationFrame(() => {
                            timeoutId = setTimeout(tick, delay);
                        });
                    }
                });
            } else if (delay) {
                requestAnimationFrame(() => {
                    timeoutId = setTimeout(tick, delay);
                });
            }
        };

        requestAnimationFrame(() => {
            timeoutId = setTimeout(tick, delay);
        });

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [delay]);
};

export default useRecursiveTimeout;
