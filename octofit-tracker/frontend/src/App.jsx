import { Link, NavLink, Route, Routes } from 'react-router-dom'
import octofitLogo from '../../../docs/octofitapp-small.png'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'

const navigation = [
  ['Activities', '/activities'],
  ['Leaderboard', '/leaderboard'],
  ['Teams', '/teams'],
  ['Users', '/users'],
  ['Workouts', '/workouts'],
]

function Home() {
  return (
    <main className="container py-5">
      <h1>Welcome to OctoFit Tracker</h1>
      <p className="lead">Track your activity, find your team, and keep moving.</p>
      <div className="d-flex flex-wrap gap-2 mt-4">
        {navigation.map(([label, path]) => (
          <Link className="btn btn-primary" key={path} to={path}>
            Explore {label}
          </Link>
        ))}
      </div>
    </main>
  )
}

function NotFound() {
  return (
    <main className="container py-5">
      <h1>Page not found</h1>
      <Link to="/">Return home</Link>
    </main>
  )
}

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container flex-wrap">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <img src={octofitLogo} alt="" width="40" height="40" />
            OctoFit Tracker
          </Link>
          <div className="navbar-nav flex-row flex-wrap">
            {navigation.map(([label, path]) => (
              <NavLink
                className={({ isActive }) =>
                  `nav-link px-2${isActive ? ' active' : ''}`
                }
                key={path}
                to={path}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/users" element={<Users />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
