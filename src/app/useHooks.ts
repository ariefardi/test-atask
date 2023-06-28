"use client";
import { useCallback, useEffect, useState } from "react";
import axios from "./axios";
import { IPropsSearch, UserData } from "./type";
const useHooks = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [seachResult, setSearchResult] = useState<UserData[]>([]);
  const [collapsedItems, setCollapsedItems] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  // const

  const onChangeSearch = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const promises: any = [];
      setPage(1);
      const response = await axios.get(`/search/users?q=${searchInput}&per_page=5&page=${1}`);

      const data: IPropsSearch = response?.data;
      data.items.forEach((item) => {
        promises.push(axios.get(`/users/${item?.login}/repos`));
      });
      const responsePromises: any = await Promise.all(promises);
      const mappedResult: UserData[] = data?.items.map((di, index) => {
        return {
          ...di,
          repos: responsePromises[index].data,
          collapsed: false,
        };
      });
      setTotalPages(Math.ceil(data?.total_count / 5));
      setSearchResult(mappedResult);
      setIsSearch(true);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [searchInput, page]);

  console.log("total Pages", totalPages);

  const toggleCollapse = (index: number) => {
    setCollapsedItems((prevState: any) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleKeyDown = useCallback(
    (event: any) => {
      if (event.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const loadMore = useCallback(async () => {
    setLoading(true);
    try {
      setPage(page + 1);
      const promises: any = [];
      const response = await axios.get(
        `/search/users?q=${searchInput}&per_page=5&page=${page + 1}`
      );

      const data: IPropsSearch = response?.data;
      data.items.forEach((item) => {
        promises.push(axios.get(`/users/${item?.login}/repos`));
      });
      const responsePromises: any = await Promise.all(promises);
      const mappedResult: UserData[] = data?.items.map((di, index) => {
        return {
          ...di,
          repos: responsePromises[index].data,
          collapsed: false,
        };
      });
      setSearchResult([...seachResult, ...mappedResult]);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [page, searchInput, seachResult]);

  return {
    searchInput,
    isSearch,
    seachResult,
    collapsedItems,
    loading,
    page,
    totalPages,
    onChangeSearch,
    handleSearch,
    toggleCollapse,
    handleKeyDown,
    loadMore,
  };
};

export default useHooks;
