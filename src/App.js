import './App.css';
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "./pages/index";
import Route from './pages/route';
import Trip from './pages/trip';
import NewTrip from './pages/new_trip';

function App() {
  console.log("Starting with basename", process.env.PUBLIC_URL);
  let router = createHashRouter([
    {
      path: "/",
      element: <Index/>,
    },
    {
      path: "/route/:route",
      element: <Route />,
    },
    {
      path: "/trip/:tripName",
      element: <Trip />,
    },
    {
      path: "/newtrip",
      element: <NewTrip />,
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
