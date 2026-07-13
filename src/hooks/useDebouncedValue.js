import { useEffect, useState } from "react";

/**
 * Menunda pembaruan nilai hingga pengguna berhenti mengubahnya selama `delay` ms.
 */
export default function useDebouncedValue(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => window.clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}
