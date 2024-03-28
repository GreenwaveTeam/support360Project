import { Link } from "react-router-dom";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import BackHandIcon from "@mui/icons-material/BackHand";
import ReplyIcon from "@mui/icons-material/Reply";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import notfoundimg from "../../resources/images/page404.jpg";

const NotFound = () => {
  return (
    <div
      id="not-found"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <br />
      <br />
      <img
        src={notfoundimg}
        alt="404page"
        style={{ height: "300px", width: "300px" }}
      ></img>
      <center>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FindInPageIcon /> &nbsp; Page not Found
        </div>
        <br />
        <div>
          <Link to="/">
            {" "}
            <ReplyIcon fontSize="small" />
            Back to Homepage
          </Link>
        </div>
      </center>
    </div>
  );
};

export default NotFound;
