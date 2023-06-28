"use client";
import Image from "next/image";
import React from "react";
import { RepoData } from "./type";
import useHooks from "./useHooks";
export default function Home() {
  const {
    searchInput,
    isSearch,
    seachResult,
    collapsedItems,
    loading,
    onChangeSearch,
    handleSearch,
    toggleCollapse,
    handleKeyDown,
  } = useHooks();
  return (
    <>
      <div className="flex flex-col p-5">
        <div className="flex-1">
          <input
            type="text"
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder="Enter Username"
            className="w-full bg-gray-200 border border-gray-300 rounded-sm px-4 py-2"
            value={searchInput}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex-1 mt-4">
          {searchInput ? (
            <div className="w-full bg-blue-400 rounded-sm cursor py-2" onClick={handleSearch}>
              <div className="text-center text-white"> {loading ? "Loading ....." : "Search"} </div>
            </div>
          ) : (
            <div className="w-full bg-gray-400 rounded-sm py-2">
              <div className="text-center text-white"> Search</div>
            </div>
          )}
        </div>
        {(searchInput && isSearch) || seachResult.length ? (
          <div className="flex-1 mt-4">
            <div className="text-gray-600">Showing users for {`"${searchInput}"`}</div>
          </div>
        ) : (
          <></>
        )}
        {!!seachResult.length && (
          <div className="flex flex-col">
            {seachResult.map((sr, index) => (
              <React.Fragment key={sr?.id}>
                <div
                  className="flex bg-gray-400 mt-4 px-4 py-2"
                  onClick={() => toggleCollapse(index)}
                >
                  <div className="flex-1"> {sr?.login} </div>
                  <div style={{ transform: collapsedItems[index] && "rotate(180deg)" }}> ^ </div>
                </div>
                {collapsedItems[index] && (
                  <div className="flex flex-col pl-4">
                    {sr.repos.map((repo: RepoData, index: number) => (
                      <div key={index} className="bg-gray-200 mt-4 flex flex-col pt-2 pb-8 px-4">
                        <div className="flex flex-1">
                          <div className="flex-grow font-bold text-xl">{repo?.full_name}</div>
                          <div className="flex-shrink">{repo?.stargazers_count}</div>
                          <div className="flex-shrink">*</div>
                        </div>
                        <div className="flex-1 text-base">
                          {repo?.description || "No Description"}
                        </div>
                      </div>
                    ))}
                    {!sr.repos.length && <div> No repo</div>}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
