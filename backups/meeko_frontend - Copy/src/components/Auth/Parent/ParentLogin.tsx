import i1 from "../../../assets/images/first-e-learners-signup-img.png";
import i2 from "../../../assets/images/second-e-learners-signup-img.png";
import i3 from "../../../assets/images/third-e-learners-signup-img.png";
import educator from '../../../assets/images/Educator.png';
import LoginTemp from "../Template/LoginTemp";
function ParentLogin() {
  return (
   <div>
    <LoginTemp
      images={[i1, i2, i3]}
      logo={educator}
      welcomeTitle="Hey !"
      welcomeSubtitle="Welcome Back Meeko Parent.."
      loginUrl="http://localhost:3000/users/parentslogin"
      redirectUrl="/parent/dashboard"
    />
   </div>
  );
}


export default ParentLogin;
