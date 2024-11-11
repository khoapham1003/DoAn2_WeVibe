//Layout
import UnlogLayout from "../Layouts/UnlogLayout";
import LogLayout from "../Layouts/LogLayout";
import DefaultLayout from "../Layouts/DefaultLayout";

//Pages
import CartPage from "../../pages/CartPage/CartPage";
import ConfirmCode from "../../pages/ConfirmCode";
import ForgotPasswordPage from "../../pages/ForgotPassword/ForgotPassword";
import MainPage from "../../pages/MainPage/MainPage";
import ProductPage from "../../pages/ProductPage/ProductPage";
import SignIn from "../../pages/SignIn/SignIn";
import SignUp from "../../pages/SignUp/SignUp";
import ChangePasswordPage from "../../pages/ChangePasswordPage";
import ProfilePage from "../../pages/ProfilePage";
import CheckoutPage from "../../pages/CheckoutPage";
import FilteredPage from "../../pages/Category";
import SearchPage from "../../pages/SearchPage";
import HistoryOrderPage from "../../pages/HistoryOrderPage";

function DefineLayout() {
  const isUserAuthenticated = () => {
    const accessToken = getCookie("accessToken");
    const userid = getCookie("userid");

    if (accessToken && userid) {
      try {
        const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));

        if (decodedToken && decodedToken.exp) {
          const currentTimeInSeconds = Math.floor(Date.now() / 1000);
          return decodedToken.exp > currentTimeInSeconds;
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    return false;
  };

  const getCookie = (cookieName) => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === cookieName) {
        return value;
      }
    }
    return null;
  };
  return isUserAuthenticated() ? DefaultLayout : UnlogLayout;
}

//PublicRoutes
const publicRoutes = [
  { path: "/", component: MainPage, layout: DefineLayout() },
  { path: "/:selectedMenu", component: FilteredPage, layout: DefineLayout() },
  { path: "/sign_in", component: SignIn, layout: LogLayout },
  { path: "/sign_up", component: SignUp, layout: LogLayout },
  {
    path: "/product-detail/:id",
    component: ProductPage,
    layout: DefineLayout(),
  },
  {
    path: "/forgot_password",
    component: ForgotPasswordPage,
    layout: LogLayout,
  },
  {
    path: "/change_password",
    component: ChangePasswordPage,
    layout: LogLayout,
  },
  { path: "/confirm_code", component: ConfirmCode, layout: LogLayout },

  {
    path: "/search/:searchValue",
    component: SearchPage,
    layout: DefineLayout(),
  },
];
//PrivateRoutes
const privateRoutes = [
  { path: "/profile_page", component: ProfilePage, layout: DefineLayout() },
  { path: "/checkout", component: CheckoutPage, layout: DefineLayout() },
  { path: "/cart", component: CartPage },
  { path: "/history", component: HistoryOrderPage, layout: DefineLayout() },
];

export { publicRoutes, privateRoutes };
