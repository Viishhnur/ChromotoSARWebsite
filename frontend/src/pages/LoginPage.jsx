import { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { handleError, handleSucess } from '../utils/utils';
import { ToastContainer } from 'react-toastify';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  let navigate = useNavigate();
  const handleFormSubmission = async (event) => {
    event.preventDefault();
    console.log(formData);
    const {email,password} = formData;

    try{
      const url = "http://localhost:8080/auth/login";

      const response = await fetch(url,{
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({email : email ,password : password})
      });

      /*
      message: "Login successfull", success: true, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlZXBha0BnbWFpbC5jb20iLCJuYW1lIjoiZGVlcGFrIiwiX2lkIjoiNjc2YzY3MGQ3OTk1ZmE0YTBkZjc0NzA1IiwiaWF0IjoxNzM1MTU4NTk2LCJleHAiOjE3MzUxNTg2NTZ9.Cd3O5kwQ-BKfX7ubv703eHhVgG8WsRELe9jM1GRzNAA", name: "deepak", email: "deepak@gmail.com" 
      */
      const result = await response.json();
      let {success , message , token , name , error} = result;
      console.log(result);

      if(success){
        handleSucess(message);
        localStorage.setItem('token',token);
        localStorage.setItem('loggedInUser',name);
        localStorage.setItem('emailId',email);
        setTimeout(()=>{
          navigate('/home')
        },5000);
      }
      else if(error){
        // const details = error?.details[0].message;  
        let errorMessage = error?.[0]?.message || "An unexpected error occurred";
        handleError(errorMessage);
      }
      else if(!success){
        handleError(message);
      }



    }catch(err){
      handleError(err);
    }
    
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <iframe
        src="https://www.youtube.com/embed/0FBiyFpV__g?autoplay=1&mute=1&loop=1&playlist=0FBiyFpV__g&controls=0&showinfo=0&rel=0&modestbranding=1"
        className="absolute top-1/2 left-1/2 w-[200%] h-[200%] md:w-[150%] md:h-[150%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ border: 'none' }}
        allow="autoplay"
      />
      <div className="min-h-screen flex items-center justify-center relative z-10 w-full max-w-4xl">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-lg">
          <div className="bg-black/50 p-8 sm:p-12 rounded-2xl backdrop-blur-xl shadow-2xl border border-gray-600/20">
            <div className="mb-8 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Login</h1>
              <p className="text-gray-300 text-md sm:text-lg">Access your account</p>
            </div>
            
            <form className="space-y-6 sm:space-y-8" onSubmit={handleFormSubmission}>
              <div>
                <label className="block text-gray-200 text-sm font-semibold mb-3">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl bg-white/10 border border-gray-400/30
                           text-white placeholder-gray-400 focus:outline-none focus:border-blue-500
                           focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-gray-200 text-sm font-semibold mb-3">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl bg-white/10 border border-gray-400/30
                           text-white placeholder-gray-400 focus:outline-none focus:border-blue-500
                           focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white
                         rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700
                         transition-all duration-300 mt-6"
              >
                Sign in
              </button>

              <div className="text-center mt-6 pt-4 border-t border-gray-600/20">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup"
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                  >
                    Sign up
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

export default LoginPage;
