"use client";
import { useCallback, useState } from "react";
import axios from "./axios";
import { IPropsSearch, UserData } from "./type";
const useHooks = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [seachResult, setSearchResult] = useState<UserData[]>([]);
  const [collapsedItems, setCollapsedItems] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  // const

  const onChangeSearch = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const promises: any = [];
      const response = await axios.get(`/search/users?q=${searchInput}&per_page=5`);
      const data: IPropsSearch = response?.data;
      data.items.forEach((item) => {
        promises.push(axios.get(`/users/${item?.login}/repos?per_page=3`));
      });
      const responsePromises: any = await Promise.all(promises);
      const mappedResult: UserData[] = data?.items.map((di, index) => {
        return {
          ...di,
          repos: responsePromises[index].data,
          collapsed: false,
        };
      });
      setSearchResult(mappedResult);
      setIsSearch(true);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [searchInput]);

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

  return {
    searchInput,
    isSearch,
    seachResult,
    collapsedItems,
    loading,
    onChangeSearch,
    handleSearch,
    toggleCollapse,
    handleKeyDown,
  };
};

export default useHooks;
