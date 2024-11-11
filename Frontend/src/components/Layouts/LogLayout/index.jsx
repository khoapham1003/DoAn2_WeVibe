import background_log from "../../../assets/images/background_log.png";
import Footer from "../DefaultLayout/Footer/Footer";
import Header from "./Header/Header";

function LogLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <div
        className="content"
        style={{
          backgroundImage: `url(${background_log})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          flex: 1,
        }}
      >
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default LogLayout;
