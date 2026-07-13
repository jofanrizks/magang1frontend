import { useCallback, useEffect, useRef } from "react";

/**
 * Membatasi pemanggilan callback agar paling cepat sekali setiap `delay` ms.
 */
export default function useThrottledCallback(callback, delay = 300) {
    const callbackRef = useRef(callback);
    const lastCalledRef = useRef(0);
    const timeoutRef = useRef(null);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        return () => window.clearTimeout(timeoutRef.current);
    }, []);

    return useCallback((...args) => {
        const remaining = delay - (Date.now() - lastCalledRef.current);

        if (remaining <= 0) {
            lastCalledRef.current = Date.now();
            callbackRef.current(...args);
            return;
        }

        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
            lastCalledRef.current = Date.now();
            callbackRef.current(...args);
        }, remaining);
    }, [delay]);
}
