import i1 from '../../../assets/images/first-educator-signup-img.png';
import i2 from '../../../assets/images/second-educator-signup-img.png';
import i3 from '../../../assets/images/third-educator-signup-img.png';
import educator from '../../../assets/images/Learner.png';
import LoginTemp from "../Template/LoginTemp";

function EducatorLogin() {
  return (
    <div>
       <LoginTemp
           images={[i1,i2,i3]}
           logo={educator}
           welcomeTitle="Welcome Educator!"
           welcomeSubtitle="Please login to continue."
           loginUrl="http://localhost:3000/users/educatorlogin"
           redirectUrl="/educator/dashboard"
       />
    </div>
  )
}

export default EducatorLogin