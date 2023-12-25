import { get } from "../helpers/api_helper";
import { useQuery } from "react-query";
import {
  REACT_QUERY_CACHE_TIME,
  REACT_QUERY_RETRY,
  REACT_QUERY_STALE_TIME,
} from "../constants/react-query";
import { log } from "../helpers/environment";

export function useListQuery({
  url,
  key,
  isEnabled = true,
  paginated = false,
  paginationConfig = {}, // pagination config
}) {
  /* pagination stuff */
  // const params = {
  //   page: 1,
  //   ...paginationConfig,
  // };
  // const { limit, ...keysObject } = params;

  /* useQuery config */
  const queryKey = paginated ? [key, { ...paginationConfig }] : key;

  const options = {
    retry: REACT_QUERY_RETRY,
    keepPreviousData: false,
    staleTime: REACT_QUERY_STALE_TIME,
    cacheTime: REACT_QUERY_CACHE_TIME,
    refetchOnWindowFocus: false,
    // turned on / off query api
    enabled: isEnabled,

    // ** Refetch queries on ...
    // refetchOnmount: false,
    // refetchOnReconnect: false,
  };

  return useQuery(queryKey, () => get(url), { ...options });
}

export function useGetQuery({ url, key, id }, isEnabled = true) {
  const options = {
    retry: REACT_QUERY_RETRY,
    staleTime: REACT_QUERY_STALE_TIME,
    cacheTime: REACT_QUERY_CACHE_TIME,
    refetchOnWindowFocus: false,
    // turned on / off query api
    enabled: isEnabled,
  };
  return useQuery([key, id], () => get(url), { ...options });
}

export const reactQueryCacheCleaner = ({
  queryClient,
  invalidateKeys = [],
  resetKeys = [],
}) => {
  // Reseting queries
  if (resetKeys.length !== 0) {
    log(`Reseting queries ...`);
    log(resetKeys);
  }
  resetKeys.forEach(key => {
    queryClient.resetQueries(key);
  });

  // Invalidating queries
  if (invalidateKeys.length !== 0) {
    log(`Invalidating queries ...`);
    log(invalidateKeys);
  }
  invalidateKeys.forEach(key => {
    queryClient.invalidateQueries(key);
  });
};
