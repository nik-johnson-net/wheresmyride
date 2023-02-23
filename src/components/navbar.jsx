import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg fixed-bottom navbar-light bg-light">
      <div className="navbar-brand">Where's My Ride?</div>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapsed" aria-controls="navbarCollapsed" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapsed">
        <div className="navbar-nav">
          <NavLink to="/" className={selectStyle}>Home</NavLink>
          <NavLink to="/trips" className={selectStyle}>Trips</NavLink>
          <NavLink to="/newtrip" className={selectStyle}>New Trip</NavLink>
          <NavLink to="/routes" className={selectStyle}>Routes</NavLink>
        </div>
      </div>
    </nav>
  )
}

function selectStyle({isActive}) {
  return isActive ? "nav-item nav-link active" : "nav-item nav-link";
}