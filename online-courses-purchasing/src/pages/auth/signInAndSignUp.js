import axios from "axios";
import { useState } from "react";
// import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
export default function SignUpAndSignIn() {
  const url = "http://localhost:5000";
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = location.state;
  const user = null;
  const [isSignInForm, setIsSignInForm] = useState(true);

  const [signInUser, setSignInUser] = useState({
    email: "",
    password: "",
    role: role,
  });

  const [signUpUser, setSignUpUser] = useState({
    email: "",
    password: "",
    role: role,
    confirmPassword: "",
  });

  const handleChangeSignIn = (e) => {
    setSignInUser({ ...signInUser, [e.target.name]: e.target.value });
  };

  const handleChangeSignUp = (e) => {
    setSignUpUser({ ...signUpUser, [e.target.name]: e.target.value });
  };

  const handleSubmitSignIn = async (e) => {
    e.preventDefault();
    await axios
      .post(url + "/auth/login-user", signInUser, { withCredentials: true })
      .then(() => {
        alert("User logged in successfully");
        navigate("/");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    console.log(signUpUser);
    if (signUpUser.password === signUpUser.confirmPassword) {
      try {
        await axios.post(url + "/auth/register-user", signUpUser, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        alert("User created successfully");
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Passwords do not match");
    }
  };
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex justify-center py-10 w-8/12 h-2/3">
        {user === null ? (
          isSignInForm ? (
            <form
              onSubmit={handleSubmitSignIn}
              className="bg-white p-8 rounded-lg shadow-md flex w-1/2 flex-col gap-5 justify-center items-center"
            >
              <h2 className="text-3xl font-bold px-2">Sign In</h2>
              <span className="text-sm font-medium">Sign in as a {role}</span>
              <input
                required
                type="email"
                placeholder="Email"
                name="email"
                className="px-5 py-1 border-2 rounded-md"
                onChange={handleChangeSignIn}
                value={signInUser.email}
              />
              <input
                type="password"
                placeholder="password"
                name="password"
                className="px-5 py-1 border-2 rounded-md"
                onChange={handleChangeSignIn}
                value={signInUser.password}
              />
              <button
                type="submit"
                className="bg-blue-500 px-4 py-2 rounded-md shadow-md text-lg hover:bg-blue-700 text-white"
              >
                Submit
              </button>
              <p
                className="text-blue-600 hover:cursor-pointer"
                onClick={() => setIsSignInForm(false)}
              >
                Register in? SignUp
              </p>
            </form>
          ) : (
            <form
              onSubmit={handleSubmitSignUp}
              className="bg-white p-8 rounded-lg shadow-md w-1/2 flex flex-col gap-3 justify-center items-center"
            >
              <h2 className="text-3xl font-bold p-2">Sign Up</h2>
              <span className="text-sm font-medium">Sign up as a {role}</span>
              <input
                required
                type="email"
                placeholder="Email"
                name="email"
                className="px-5 py-1 border-2 rounded-md"
                onChange={handleChangeSignUp}
                value={signUpUser.email}
              />
              <input
                type="password"
                placeholder="password"
                name="password"
                className="px-5 py-1 border-2 rounded-md"
                onChange={handleChangeSignUp}
                value={signUpUser.password}
              />

              <input
                type="password"
                placeholder="confirmPassword"
                name="confirmPassword"
                className="px-5 py-1 border-2 rounded-md"
                onChange={handleChangeSignUp}
                value={signUpUser.confirmPassword}
              />
              <button
                type="submit"
                className="bg-blue-500 px-4 py-2 rounded-md shadow-md text-lg hover:bg-blue-700 text-white"
              >
                Submit
              </button>
              <p
                className="text-blue-600 hover:cursor-pointer"
                onClick={() => setIsSignInForm(true)}
              >
                Already have an accout? SignIn
              </p>
            </form>
          )
        ) : (
          <div className="flex flex-col gap-4 justify-center items-center">
            <h1 className="text-xl font-bold">
              Wanna Logout? just press the button politely..
            </h1>
            <button
              className="px-3 py-1 bg-red-500 text-white w-fit text-lg rounded-md shadow-md"
              onClick={(e) => {}}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
