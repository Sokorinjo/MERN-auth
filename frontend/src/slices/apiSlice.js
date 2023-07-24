import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//It's empty because it's already in proxy
//If it wasn't, it would be {baseUrl: 'http://localhost:5000'}
const baseQuery = fetchBaseQuery({ baseUrl: "" });

export const apiSlice = createApi({
  baseQuery,
  //tag types has to do with cashing
  tagTypes: ["User"],
  endpoints: (builder) => ({

  }),
});



