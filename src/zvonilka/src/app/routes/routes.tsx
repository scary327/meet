import type { RouteObject } from "react-router-dom";
import { URLS } from "./urls";
import { lazy } from "react";

const Home = lazy(() => import("../../pages/Home/Home"));
const Room = lazy(() => import("../../pages/Room/Room"));

export const routes: RouteObject[] = [
  {
    path: URLS.home,
    element: <Home />,
  },
  {
    path: URLS.room,
    element: <Room />,
  },
];
