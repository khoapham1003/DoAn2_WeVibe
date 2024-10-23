import { Fragment, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes, privateRoutes } from "../Routes/index";
import DefaultLayout from "../Layouts/DefaultLayout";
import { message } from "antd";

function AppRoutes() {
  useEffect(() => {}, []);


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

  const isUserAuthenticated = () => {
    const accessToken = getCookie('accessToken');
    const userid = getCookie('userid');
  
    if (accessToken && userid) {
      try {
        const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
  
        if (decodedToken && decodedToken.exp) {
          const currentTimeInSeconds = Math.floor(Date.now() / 1000);
          return decodedToken.exp > currentTimeInSeconds;
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  
    return false;
  };
  console.log('Is user authenticated:', isUserAuthenticated());

  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes.map((route, index) => {
          const Page = route.component;
          let Layout = DefaultLayout;

          if (route.layout) {
            Layout = route.layout;
          } else if (route.layout === null) {
            Layout = Fragment;
          }

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}

        {privateRoutes.map((route, index) => {
          const Page = route.component;
          let Layout = DefaultLayout;

          if (route.layout) {
            Layout = route.layout;
          } else if (route.layout === null) {
            Layout = Fragment;
          }

          return (
            <Route
              key={index}
              path={route.path}
              element={
                isUserAuthenticated() ? (
                  <Layout>
                    <Page />
                  </Layout>
                ) : (
                  <>
                    <Navigate to="/sign_in" />
                  </>
                )
              }
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
