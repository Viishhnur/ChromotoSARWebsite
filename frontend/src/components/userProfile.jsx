import { useState, useEffect } from 'react';
import { UserCircle } from 'lucide-react';

function UserProfileNetra() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [emailId, setEmail] = useState("");

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
    setEmail(localStorage.getItem('emailId'));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-gray-700">
          <div className="flex flex-col items-center">
            {/* Avatar Section */}
            <div className="mb-6">
              <UserCircle className="w-32 h-32 text-blue-400" />
            </div>

            {/* User Info */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">{loggedInUser}</h1>
              <p className="text-blue-400">{emailId}</p>
            </div>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-6">
              <div className="bg-white/5 p-6 rounded-xl border border-gray-700">
                <h3 className="text-gray-400 text-sm mb-2">Student ID</h3>
                <p className="text-white font-semibold">22BD1A051G</p>
              </div>

              <div className="bg-white/5 p-6 rounded-xl border border-gray-700">
                <h3 className="text-gray-400 text-sm mb-2">Branch</h3>
                <p className="text-white font-semibold">CS</p>
              </div>

              <div className="bg-white/5 p-6 rounded-xl border border-gray-700">
                <h3 className="text-gray-400 text-sm mb-2">Section</h3>
                <p className="text-white font-semibold">E31</p>
              </div>

              <div className="bg-white/5 p-6 rounded-xl border border-gray-700">
                <h3 className="text-gray-400 text-sm mb-2">Sanjaya ID</h3>
                <p className="text-white font-semibold">2421880</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 w-full flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition duration-300">
                Edit Profile
              </button>
              <button className="flex-1 bg-gray-700 text-white py-3 px-6 rounded-xl hover:bg-gray-600 transition duration-300">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileNetra;