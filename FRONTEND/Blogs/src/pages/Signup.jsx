import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineLogin } from "react-icons/hi";
import axios from 'axios';


function Signup() {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);


  const apiUrl = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState(" ");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  useState(() => {
    if (localStorage.getItem("token")) {
      window.location.href = "/";
    }
  }, [])

  const capitalizeWords = (str) => {
    return str.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) {
      return
    }
    setLoading(true);

    const response = await fetch(`${apiUrl}/createtempuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: capitalizeWords(fullName),
        email,
        bio: bio || " ",
        password,
      }),
    })

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      console.log(data);
      return toast.error(data.error);
    }

    console.log(data);
    toast.success(data.message);
    setStep(2);
  };


  // function to verify the otp
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (loading) {
      return
    }
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/verify/userregistration`, {
        email, otp
      })
      console.log("Response:", response.data);
      toast.success("User registered successfully");
      setStep(3);
      setLoading(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error Verifying otp!";
      toast.error(errorMessage);
      console.log("error while verifying otp :", error);
    } finally {
      setLoading(false);
    }




    //   try {
    //     const response = await axios.post(`${apiUrl}/verify/userregistration"`, {
    //         email, otp, password
    //     });
    //     console.log("Response:", response.data);
    //     toast.success("Password reset successfully");
    //     setStep(3);
    // } catch (error) {
    //     const errorMessage = error.response?.data?.message || "Error Verifying otp!";
    //     toast.error(errorMessage);
    //     console.log("Error while verifying otp :", error);
    // } finally {
    //     setLoading(false);
    // }



  }


  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">


          {/* step 1  */}
          {step == 1 && <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSignup}>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your full name
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                  placeholder=""
                  required
                  minLength={3}
                />
              </div>
              <div>
                <label
                  htmlFor="bio"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  About yourself
                </label>
                <textarea
                  type="text"
                  name="bio"
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-gray-50 border h-20 max-h-32 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                  placeholder="Optional"
                  minLength={3}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                  placeholder=""
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                  required
                  minLength={3}
                />
              </div>

              <button
                type="submit"
                className={` ${loading && "cursor-wait"} w-full flex justify-center items-center gap-3 text-white bg-orange-500 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center `}>
                {loading && <img src="/Loading.gif" alt="Loading" className="h-5" />}
                {!loading && "Send OTP"}
              </button>


              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to={"/login"}
                  className="font-medium text-orange-600 hover:underline"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>}



          {/* step 2  */}
          {step == 2 && <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Enter OTP
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleVerifyOtp}>
              <div>
                <label
                  htmlFor="otp"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your OTP sent to {email ? email : "Your email"}
                </label>
                <input
                  type="number"
                  name="otp"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                  placeholder=""
                  max={999999}
                  min={99}
                  required
                />
              </div>
              <button
                type="submit"
                className={` ${loading && "cursor-wait"} w-full flex justify-center items-center gap-3 text-white bg-orange-500 hover:bg-orange-700focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}>
                {loading && <img src="/Loading.gif" alt="Loading" className="h-5" />}
                {!loading && "Verify"}
              </button>
            </form>
          </div>}

          {/* step 3  */}
          {step == 3 && <section
            className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8"
          >
            <h1 className=" mb-10 text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-green-600 text-center">
              Account Created successfully
            </h1>
            <div className="mt-4 flex justify-center items-center flex-wrap gap-2 space-x-4">
              <Link to={"/login"}>
                <button className="w-40 flex justify-center items-center px-4 py-2 bg-orange-500 hover:bg-orange-700 text-white rounded-lg  transition">
                  <HiOutlineLogin className="mr-2" />
                  Login
                </button>
              </Link>

            </div>
          </section>}


        </div>
      </div>

      {/* toaseter  */}

      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </section>
  );
}

export default Signup;