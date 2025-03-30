import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import MovieRental from "./pages/MovieRental.jsx";
import RentalHistory from "./pages/RentalHistory.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "/rental", element: <MovieRental /> },
      { path: "/rentals", element: <RentalHistory /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
