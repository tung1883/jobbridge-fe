import { useState, useEffect, useRef, useCallback } from "react"

export function useAsync(fn, deps = []) {
    const [state, setState] = useState({ data: null, loading: true, error: null })
    const fnRef = useRef(fn)
    fnRef.current = fn

    useEffect(() => {
        let cancelled = false
        setState((s) => ({ ...s, loading: true, error: null }))
        Promise.resolve(fnRef.current())
            .then((data) => {
                if (!cancelled) setState({ data, loading: false, error: null })
            })
            .catch((err) => {
                if (!cancelled) setState({ data: null, loading: false, error: err.message || "Error" })
            })
        return () => {
            cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- deps forwarded from caller
    }, deps)

    const refetch = useCallback(() => {
        setState((s) => ({ ...s, loading: true, error: null }))
        return Promise.resolve(fnRef.current())
            .then((data) => {
                setState({ data, loading: false, error: null })
                return data
            })
            .catch((err) => {
                setState({ data: null, loading: false, error: err.message || "Error" })
                throw err
            })
    }, [])

    return { ...state, refetch }
}
