import logo from '../../assets/images/meeko-white-logo.png';
import { FaFacebookF, FaYoutube, FaInstagram, FaPinterestP, FaTwitter, FaSnapchatGhost, FaTelegramPlane } from 'react-icons/fa';
import { GiPenguin } from 'react-icons/gi';

function Footer() {
    return (
        <div className="bg-cyan-500 text-white pt-10 pb-5">
            <div className="footer_grid flex flex-wrap justify-between px-10">
                {/* Column 1: Logo & Tagline */}
                <div className="footer_items p-5">
                    <img src={logo} className="h-11 w-auto" alt="Meeko Logo" />
                    <div className="text-xl font-semibold mt-4">
                        Learn. Play. <br /> Teach. Explore
                    </div>
                </div>

                {/* Column 2: Navigation Links */}
                <div className="footer_second_col p-5 flex flex-col justify-center">
                    <div className="flex flex-wrap gap-4 text-lg font-medium mb-4">
                        <a href="/about-us">About us</a>
                        <span>|</span>
                        <a href="/about-us">Contact us</a>
                        <span>|</span>
                        <a href="/about-us">Blog</a>
                        <span>|</span>
                        <a href="/about-us">Privacy Policy</a>
                        <span>|</span>
                        <a href="/about-us">FAQ’s</a>
                    </div>
                    <p className="text-sm max-w-xl">
                        2023 © MEEKO Enterprises Private Limited. All Rights Reserved. Above mentioned contents are subject to change without notice and are copyrighted by Meeko Enterprises Private Limited.
                    </p>
                </div>

                {/* Column 3: Social Icons */}
                <div className="footer_third_col p-5 gap-4 ">
                    <div className='flex gap-4 m-4'>
                        <FaFacebookF className="text-2xl cursor-pointer" />
                        <FaYoutube className="text-2xl cursor-pointer" />
                        <FaInstagram className="text-2xl cursor-pointer" />
                    </div>
                    <div className='flex gap-4 m-4'>
                        <FaPinterestP className="text-2xl cursor-pointer" />
                        <FaTwitter className="text-2xl cursor-pointer" />
                        <FaSnapchatGhost className="text-2xl cursor-pointer" />
                    </div>
                    <div className='flex gap-4 m-4'>
                        <FaTelegramPlane className="text-2xl cursor-pointer" />
                        <GiPenguin className="text-2xl cursor-pointer" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
