import react, { Component } from "react";
import NewsItem from "./NewsItem";

const Loading = () => {
  return (
    <>
      <div className="mt-1 row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 g-4">
        <NewsItem className="col" loading={true} imgsource="/imgloading.png" />
        <NewsItem className="col" loading={true} imgsource="/imgloading.png" />
        <NewsItem className="col" loading={true} imgsource="/imgloading.png" />
        <NewsItem className="col" loading={true} imgsource="/imgloading.png" />
        <NewsItem className="col" loading={true} imgsource="/imgloading.png" />
        <NewsItem className="col" loading={true} imgsource="/imgloading.png" />
      </div>
    </>
  );
};

export default Loading;
