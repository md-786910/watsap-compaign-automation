import { useState, useEffect } from "react";
import axiosInstance from "../config/axios";


export function useFetch(
  url,
  options,
  dependencies
) {
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;
    setState((prev) => ({ ...prev, loading: true }));

    const fetchData = async () => {
      try {
        const response = await axiosInstance(url, options);
        if (isMounted) {
          setState({ data: response.data?.data, error: null, loading: false });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: null,
            error: error.response?.data?.message || error.message,
            loading: false,
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return state;
}
