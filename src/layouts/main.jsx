import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";

export default function Main() {
  return (
    <div>
      <Outlet />
      <Navbar />
    </div>
  )
}
