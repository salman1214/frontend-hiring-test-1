import { useEffect, useRef } from 'react';


function useDidUpdate(callback, dependencies) {
    const hasMounted = useRef(false);

    useEffect(() => {
        if (hasMounted.current) {
            callback(); // Call the callback only on updates (not on mount)
        } else {
            hasMounted.current = true; // Skip the first render
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies); // dependency array that triggers the update
}

export default useDidUpdate;