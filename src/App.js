import './App.css';
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "./pages/index";
import Route from './pages/route';
import Trip from './pages/trip';
import NewTrip from './pages/new_trip';
import Main from './layouts/main';
import Routes from './pages/routes';
import Trips from './pages/trips';

function App() {
  let router = createHashRouter([
    {
      path: "/",
      element: <Main/>,
      children: [
        {
          index: true,
          element: <Index />,
        },
        {
          path: "routes",
          element: <Routes />,
        },
        {
          path: "route/:route",
          element: <Route />,
        },
        {
          path: "trips",
          element: <Trips />,
        },
        {
          path: "trip/:tripName",
          element: <Trip />,
        },
        {
          path: "newtrip",
          element: <NewTrip />,
        }
      ]
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
