import { useState, useEffect } from "react";
import { AxiosRequestConfig } from "axios";
import axiosInstance from "../config/axios";

interface FetchState<T> {
  obj: T | null;
  error: string | null;
  loading: boolean;
}

export function useFetch<T>(
  url: string,
  options?: AxiosRequestConfig,
  dependencies: unknown[] = []
) {
  const [state, setState] = useState<FetchState<T>>({
    obj: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;
    setState((prev) => ({ ...prev, loading: true }));

    const fetchobj = async () => {
      try {
        const response = await axiosInstance(url, options);
        if (isMounted) {
          setState({ obj: response.obj, error: null, loading: false });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            obj: null,
            error:
              error instanceof Error
                ? error.message
                : "An unknown error occurred",
            loading: false,
          });
        }
      }
    };

    fetchobj();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return state;
}
