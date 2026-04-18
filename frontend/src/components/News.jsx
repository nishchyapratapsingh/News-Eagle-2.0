import React, { Component, useState, useEffect } from "react";
import NewsItem from "./NewsItem";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "./Loading";

const News = (props) => {
  const [articles, setarticles] = useState([]);
  const [loading, setloading] = useState(true);
  const [page, setpage] = useState(1);
  const [catquery, setcatquery] = useState("world");
  const [totRes, settotRes] = useState(0);
  const [totPage, settotpage] = useState(1);

  const APIKEY = process.env.REACT_APP_API_KEY;

  const fetchNews = async (url) => {
    let data = await fetch(url);

    let parsedData = await data.json();
    let totalResultsAvlb =
      parsedData.totalResults < 100 ? parsedData.totalResults : 100;
    props.setProgress(40);

    setarticles(parsedData.articles);
    setloading(false);

    settotRes(totalResultsAvlb);
    settotpage(Math.ceil(totalResultsAvlb/18)-1);
    props.setProgress(100);
  };

  useEffect(() => {
    let url = `https://newsapi.org/v2/everything?q=${catquery}&pageSize=18&apiKey=${APIKEY}&page=${page}`;

    fetchNews(url);
  }, []);

  useEffect(() => {
    setcatquery(props.query);
    setloading(true);
    props.setProgress(20);
    let url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      props.query
    )}&pageSize=18&apiKey=${APIKEY}&page=1`;
    fetchNews(url);

    document.title = `${titleCase(props.query)} - NewsEagle`;
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [props.query]);

  const titleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const fetchMoreData = async () => {
   
    let nextPage = page + 1;
    if (nextPage>totPage) return;
    let url = `https://newsapi.org/v2/everything?q=${catquery}&pageSize=18&apiKey=${APIKEY}&page=${nextPage}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    props.setProgress(100);
    setTimeout(() => {
      
      setarticles(articles.concat(parsedData.articles));
      setpage(nextPage);
    }, 1500);
  };

  return (
    <>
      <div className="container" style={{ paddingTop: "56px" }}>
        <h1 className="m-2 anim text-center">
          NewsEagle - {titleCase(catquery)}
        </h1>
        {loading ? (
          <Loading />
        ) : (
          <InfiniteScroll
            style={{ overflow: "hidden" }}
            dataLength={articles.length}
            next={fetchMoreData}
            hasMore={page+1 <= totPage}
            loader={
              <>
                <Loading />
              </>
            }
          >
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 g-4">
              <>
                {Array.isArray(articles) &&
                  articles.map((element) => {
                    if(!element) return null;
                    return (
                      <div className="col" key={element.publishedAt}>
                        <NewsItem
                          title={
                            element.title && element.title.length > 50
                              ? element.title.slice(0, 50) + "..."
                              : element.title || ""
                          }
                          description={
                            element.description &&
                            element.description.length > 100
                              ? element.description.slice(0, 100) + "..."
                              : element.description || ""
                          }
                          imgsource={
                            element.urlToImage
                              ? element.urlToImage
                              : "/imgloading.png"
                          }
                          newsUrl={element.url}
                          loading={false}
                          date={element.publishedAt}
                        />
                      </div>
                    );
                  })}
              </>
            </div>
          </InfiniteScroll>
          
        )}
      </div>
    </>
  );
};

export default News;
