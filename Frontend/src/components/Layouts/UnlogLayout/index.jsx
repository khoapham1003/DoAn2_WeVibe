import Header from "./Header/Header";
import Footer from "../DefaultLayout/Footer/Footer";

function UnlogLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <div className="content">{children}</div>
      <Footer />
    </div>
  );
}

export default UnlogLayout;
