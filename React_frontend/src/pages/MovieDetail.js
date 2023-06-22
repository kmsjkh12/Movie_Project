import React from "react";
import Details from "../components/Movie/Details";
import DetailCommentWrite from "../components/Movie/DetailCommentWrite";
import DetailCommentList from "../components/Movie/DetailCommentList";

const MovieDetail = () => {
  return (
    <>
      <Details/>
      <DetailCommentWrite/>
      <DetailCommentList/>
    </>
  );
};

export default MovieDetail;
