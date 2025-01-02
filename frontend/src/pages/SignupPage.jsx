import { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // Import eye icons
import { ToastContainer } from 'react-toastify';
import { handleError, handleSucess } from '../utils/utils';
const SignUpPage = () => {
  let [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [passwordVisible, setPasswordVisible] = useState(false); // State for toggling password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // State for confirm password toggle

  let navigate = useNavigate();
  const handleChange = (event) => {
    console.log(event.target.name, event.target.value);
    setFormData((curr)=>({
      ...curr,
      [event.target.name]: event.target.value
    }))
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    const {name,email,password,confirmPassword} = formData;
    if(password != confirmPassword){
      return handleError("Passwords do not match");
    }
    try{
        
      const url = "http://localhost:8080/auth/signup";

      const response = await fetch(url,{
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({name : name,email : email ,password : password})
      });

      const result = await response.json();
      let {message , success , error} = result;
      console.log(result);

      if(success){
        handleSucess(message);
        setTimeout(()=>{
          navigate('/login')
        },5000);
      }
      else if(error){
        let errorMessage = error?.[0]?.message || "An unexpected error occurred";
        handleError(errorMessage);
      }
      else if(!success){
        handleError(message);
      }



    }catch(err){
      handleError(err);
    }
    // You can add validation logic here for password match
    // if(!name || !email){
    //   return handleError("Enter required details...");
    // }
    // else if(name && email && !password){
    //   return handleError("Enter password ...")
    // }
    // else if(name && email && password && !confirmPassword){
    //   return handleError("Confirm password ...")
    // }
    // else if(password != confirmPassword){
    //   return handleError("Passwords do not match");
    // }
    // else{
      
    // }
    // if (formData.password !== formData.confirmPassword) {
    //   alert("Passwords do not match!");
    // } else {
    //   console.log(formData);
    //   // Handle signup logic here

    // }
  };

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('https://geospatialworld.net/wp-content/uploads/2023/07/Remote-Sensing-Analysis-1600x840-1.png')" }} // Replace with your image URL
    >

<div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
  <div className="w-full max-w-lg">
    <div className="bg-black/60 p-8 sm:p-12 rounded-2xl backdrop-blur-xl shadow-2xl border border-gray-600/20 min-h-[400px] sm:min-h-[500px]">
      <div className="mb-8 sm:mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Create an Account</h1>
        <p className="text-gray-300 text-md sm:text-lg">Sign up to get started</p>
      </div>


            <form className="space-y-8" onSubmit={handleSignUp}>
              <div>
                <label className="block text-gray-200 text-sm font-semibold mb-3">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-xl bg-white/10 border border-gray-400/30
                           text-white placeholder-gray-400 focus:outline-none focus:border-blue-500
                           focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-gray-200 text-sm font-semibold mb-3">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-xl bg-white/10 border border-gray-400/30
                           text-white placeholder-gray-400 focus:outline-none focus:border-blue-500
                           focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-gray-200 text-sm font-semibold mb-3">Password</label>
                <div className="relative">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl bg-white/10 border border-gray-400/30
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500
                             focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                    placeholder="Enter your password"
                  />
                  <span
                    className="absolute top-1/2 right-5 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-gray-200 text-sm font-semibold mb-3">Confirm Password</label>
                <div className="relative">
                  <input
                    type={confirmPasswordVisible ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl bg-white/10 border border-gray-400/30
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500
                             focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                    placeholder="Confirm your password"
                  />
                  <span
                    className="absolute top-1/2 right-5 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  >
                    {confirmPasswordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white
                         rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700
                         transition-all duration-300 mt-6"
              >
                Sign up
              </button>

              <div className="text-center mt-6 pt-4 border-t border-gray-600/20">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </form>
            <ToastContainer/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
