
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

const HomeView = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

export default HomeView;