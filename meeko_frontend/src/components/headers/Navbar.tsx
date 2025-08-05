import { useEffect, useState } from 'react';
import logo from '../../assets/images/meeko-white-logo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Category {
  _id: string;
  category_name: string;
  slug: string;
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/admin/viewcategory`);
        setCategories(res.data.data);
        console.log("API data =>>", res.data.data);
      } catch (error) {
        alert(error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="w-full bg-cyan-400 shadow-md">
      <div className="flex justify-between items-center px-8 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <img className="h-8 object-cover" src={logo} alt="Meeko Logo" />
        </div>

        {/* Categories */}
        <div className="flex space-x-3">
          {categories.map((cat, index) => (
            <button
            onClick={() => navigate(`${cat.slug}`)}
              key={index}
              className="categories h-10 w-35"
            >
              {cat.category_name}
            </button>
          ))}
        </div>

        {/* Login Signup */}
        <div className="relative inline-block">
          <button
            onClick={() => setOpen(!open)}
            className="px-6 py-2 bg-white text-cyan-600 font-semibold rounded-full border border-cyan-200 
                   transition-all duration-300 ease-in-out 
                   hover:bg-yellow-400 hover:text-white hover:border-white">
            Login | Sign Up ▼
          </button>

          {open && (
            <div className="absolute left-2 mt-2 w-40 bg-white border border-gray-200 rounded-sm shadow-lg">
              <ul className="py-2 text-gray-700">
                <li className="px-4 py-2 hover:bg-yellow-100 cursor-pointer" onClick={()=>navigate('/parent/login')}>Parent</li>
                <li className="px-4 py-2 hover:bg-yellow-100 cursor-pointer">Learner</li>
                <li className="px-4 py-2 hover:bg-yellow-100 cursor-pointer" onClick={()=>navigate('/educator/login')}>Educator</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
