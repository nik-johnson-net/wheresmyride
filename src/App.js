import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "./pages/index";
import Route from './pages/route';

function App() {
  let router = createBrowserRouter([
    {
      path: "/",
      element: <Index/>,
    },
    {
      path: "/route/:route",
      element: <Route />,
    }
  ], {
    basename: process.env.PUBLIC_URL,
  });

  return (
    <RouterProvider router={router} />
  );
}

export default App;
