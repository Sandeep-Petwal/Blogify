import { useState } from "react";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from "react-router-dom";
import { HiOutlineLogin } from "react-icons/hi";

const apiUrl = import.meta.env.VITE_API_URL;

function ForgetPassword() {

    // three stpes 1. enter email , enter new password
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");



    // step 1
    const handleEmailSubmit = async (e) => {
        if (loading) {
            return
        }
        e.preventDefault();
        setLoading(true);
        console.log("Sending a mail to email account");

        try {
            const response = await axios.post(`${apiUrl}/verify/forgotpassword`, {
                email,
            });

            console.log("Response:", response.data);
            toast.success("OTP sent to your email");

            setStep(2);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error processing email!";
            toast.error(errorMessage);
            console.log("Error while fetching the user:", error);
        } finally {
            setLoading(false);
        }
    };


    // step 2,  verify otp and set new password
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("Verifying otp ");

        try {
            const response = await axios.post(`${apiUrl}/verify/verifyotp`, {
                email, otp, password
            });

            console.log("Response:", response.data);
            toast.success("Password reset successfully");
            setStep(3);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error Verifying otp!";
            toast.error(errorMessage);
            console.log("Error while verifying otp :", error);
        } finally {
            setLoading(false);
        }

    }


    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
                <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
                    <h2 className="underline underline-offset-8 text-center mb-10 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        {step !== 3 && "Password recovery"}
                    </h2>


                    {/* step one  */}
                    {step == 1 && <section>
                        <h3 className="mb-1 text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Step 1/2
                        </h3>
                        <form
                            onSubmit={handleEmailSubmit}
                            className="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Enter your email
                                </label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={` ${loading && "cursor-wait"} w-full flex justify-center items-center gap-3 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
                            >
                                {loading && <img src="/Loading.gif" alt="Loading" className="h-5" />}
                                {!loading && "Send OTP"}
                            </button>
                        </form>
                    </section>}



                    {/* step 2  */}
                    {step == 2 && <section>
                        <h3 className="mb-1 text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Step 2/2
                        </h3>
                        <form
                            onSubmit={handleVerifyOtp}
                            className="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#">
                            <div>
                                <label
                                    htmlFor="otp"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Enter 6 digit OTP
                                </label>
                                <input
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}

                                    type="number"
                                    name="otp"
                                    id="otp"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="XXXXXX"
                                    max={999999}
                                    min={99}
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Enter your new password
                                </label>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}

                                    type="password"
                                    name="password"
                                    id="password"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={` ${loading && "cursor-wait"} w-full flex justify-center items-center gap-3 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
                            >
                                {loading && <img src="/Loading.gif" alt="Loading" className="h-5" />}
                                {!loading && "Confirm OTP"}
                            </button>
                        </form>
                    </section>}




                    {/* step 3  */}
                    {step == 3 && <section>
                        <h1 className="mb-10 text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-green-600 text-center">
                            Password reset successfull
                        </h1>

                        {/* <h3
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Login to your account
                        </h3> */}


                        <div className="mt-4 flex justify-center items-center flex-wrap gap-2 space-x-4">
                            <Link to={"/login"}>
                                <button className="w-40 flex justify-center items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                                    <HiOutlineLogin className="mr-2" />
                                    Login
                                </button>
                            </Link>

                        </div>
                    </section>}


                </div>
            </div>
            {/* react hot toast */}
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </section>

    )
}

export default ForgetPassword
