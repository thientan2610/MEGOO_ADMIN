import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BgImage from "assets/banner.png";
import { Button } from "react-bootstrap";
import LoginRoutes from "routes/LoginRoutes";

const SessionExpired = () => {
  return (
    <main>
      <section
        className="d-flex align-items-center bg-soft py-5 pt-lg-6 pb-lg-5"
        style={{ backgroundImage: `url(${BgImage})` }}
      >
        <div className="centered">
          <h4>Phiên đã hết hạn</h4>
          <p>Vui lòng đăng nhập lại để làm mới phiên của bạn</p>
          <p className="text-center">
            <Button
              variant="link"
              href={LoginRoutes.children[0].path}
              className="text-gray-700"
            >
              <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Về trang
              đăng nhập
            </Button>
          </p>
        </div>
      </section>
    </main>
  );
};
export default SessionExpired;
