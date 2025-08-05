import RegisterTemp from '../Template/RegisterTemp'
import i1 from "../../../assets/images/first-parent-signup-img.png";
import i2 from "../../../assets/images/second-parent-signup-img.png";
import i3 from "../../../assets/images/third-parent-signup-img.png";
import parentLogo from "../../../assets/images/Parent.png";
function Parentsignup() {
    return (
        <div>
            <RegisterTemp 
            images={[i1, i2, i3]}
            logo={parentLogo}
            welcomeTitle="SignUp"
            welcomeSubtitle="for Parents"
            registerUrl="http://localhost:3000/users/parentsregister"
            redirectUrl="/parent/login"
             />
        </div>

    )
}

export default Parentsignup