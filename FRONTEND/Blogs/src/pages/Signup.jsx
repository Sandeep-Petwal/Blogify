import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { HiOutlineLogin } from "react-icons/hi";

function Signup() {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    mode: 'onChange',
  });

  const email = watch("email");
  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.href = "/";
    }
  }, []);

  const capitalizeWords = (str) => {
    return str.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleSignup = async (data) => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/verify/createtempuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: capitalizeWords(data.fullName),
          email: data.email,
          bio: data.bio || " ",
          password: data.password,
        }),
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        return toast.error(result.message);
      }

      toast.success(result.message);
      setStep(2);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Error signing up");
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);

    try {
      await axios.post(`${apiUrl}/verify/userregistration`, {
        email, otp
      });

      toast.success("User registered successfully");
      setStep(3);
    } catch (error) {
      console.log(error);
      toast.error("OTP does not match !");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitStep1 = async (data) => {
    await handleSignup(data);
  };

  const onSubmitStep2 = async () => {
    await handleVerifyOtp();
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">

          {/* Step 1 */}
          {step === 1 && (
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl  leading-tight tracking-tight text-white font-bold md:text-2xl ">
                Create an account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmitStep1)}>
                <div>
                  <label htmlFor="fullName" className="block mb-2 text-lg  text-white font-bold ">Your full name</label>
                  <input
                    type="text"
                    id="fullName"
                    {...register("fullName", { required: "Full name is required", minLength: { value: 3, message: "Full name must be at least 3 characters long" } })}
                    className="bg-gray-50 border border-gray-300 text-white font-bold text-lg rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                  />
                  {errors.fullName && <span className="text-red-500 dark:text-red-500 text-lg mt-2">{errors.fullName.message}</span>}
                </div>

                <div>
                  <label htmlFor="bio" className="block mb-2 text-lg  text-white font-bold ">About yourself (Optional)</label>
                  <textarea
                    id="bio"
                    className="bg-gray-50 border h-20 max-h-32 border-gray-300 text-white font-bold text-lg rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 text-lg  text-white font-bold ">Your email</label>
                  <input
                    type="email"
                    id="email"
                    {...register("email", {
                      required: "Email is required", pattern: {
                        value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    className="bg-gray-50 border border-gray-300 text-white font-bold text-lg rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-lg mt-2">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block mb-2 text-lg  text-white font-bold ">Password</label>
                  <input
                    type="password"
                    id="password"
                    {...register("password", { required: "Password is required", minLength: { value: 3, message: "Password must be at least 3 characters long" }})}
                    className="bg-gray-50 border border-gray-300 text-white font-bold text-lg rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                  />
                  {errors.password && <p className="text-red-500 text-lg mt-2">{errors.password.message}</p>}
                </div>

                <button
                  type="submit"
                  className={`${loading && "cursor-wait"} w-full flex justify-center items-center gap-3 text-white bg-orange-500 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center`}>
                  {loading && <img src="/Loading.gif" alt="Loading" className="h-5" />}
                  {!loading && "Send OTP"}
                </button>


                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have a account ?
                <Link
                  to="/login"
                  className="font-medium hover:underline text-orange-600"
                >
                  &nbsp; Login &nbsp;
                </Link>              </p>

              </form>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl  leading-tight tracking-tight text-white font-bold md:text-2xl ">Enter OTP</h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmitStep2)}>
                <div>
                  <label htmlFor="otp" className="block mb-2 text-lg  text-white font-bold ">Your OTP sent to {email}</label>
                  <input
                    type="number"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-white font-bold text-lg rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                    max={999999}
                    min={99}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={`${loading && "cursor-wait"} w-full flex justify-center items-center gap-3 text-white bg-orange-500 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center`}>
                  {loading && <img src="/Loading.gif" alt="Loading" className="h-5" />}
                  {!loading && "Verify"}
                </button>
              </form>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <section className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
              <h1 className="mb-10 text-lg  leading-tight tracking-tight text-white font-bold md:text-2xl dark:text-green-600 text-center">
                Account Created Successfully
              </h1>
              <div className="mt-4 flex justify-center items-center flex-wrap gap-2 space-x-4">
                <Link to="/login">
                  <button className="w-40 flex justify-center items-center px-4 py-2 bg-orange-500 hover:bg-orange-700 text-white rounded-lg transition">
                    <HiOutlineLogin className="mr-2" />
                    Login
                  </button>
                </Link>
              </div>
            </section>
          )}

        </div>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </section>
  );
}

export default Signup