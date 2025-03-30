import { Link, Outlet } from "react-router-dom";

const App = () => {
  return (
    <div>
      <nav>
        <Link to="/"/>
      </nav>
      <Outlet />
    </div>
  );
};

export default App;
