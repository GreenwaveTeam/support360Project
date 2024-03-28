import { Link } from "react-router-dom";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import BackHandIcon from "@mui/icons-material/BackHand";
import ReplyIcon from "@mui/icons-material/Reply";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";

const NotFound = () => {
  return (
    <div id="not-found">
      <br />
      <br />
      <center>
        <h2>Sorry...</h2>
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
