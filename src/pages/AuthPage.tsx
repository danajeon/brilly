import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';

// Info needed to connect to Supabase
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (isLogin) {
            // --- LOGIN ---
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                setErrorMsg(error.message);
            } else {
                if (data.session) {
                    navigate("/dashboard");
                }
            }
        } else {
            // --- SIGNUP ---
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                setErrorMsg(error.message);
            } else {
                // Session may not exist immediately depending on email confirmation settings
                if (data.session) {
                    navigate("/dashboard");
                } else {
                    // If confirmation required, show message
                    setErrorMsg("Check your email to confirm your account.");
                }
            }
        }
    };

    return (
        <div className="h-screen bg-[#88B1CA]">
        <div className="flex flex-col items-center justify-start h-full pt-20">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md p-6 m-1 rounded-md w-75"
            >
                <h1 className="lg:text-xl md:text-lg text-base font-bold mb-4">
                    {isLogin ? "Log In" : "Sign Up"}
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 mb-3 rounded"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-2 mb-3 rounded"
                    required
                />

                {errorMsg && (
                    <p className="text-red-500 text-sm mb-2">{errorMsg}</p>
                )}

                <button
                    type="submit"
                    className="w-full bg-[#004D7C] text-white p-2 rounded hover:bg-[#00629e] hover:cursor-pointer"
                >
                    {isLogin ? "Log In" : "Sign Up"}
                </button>

                <p
                    onClick={() => setIsLogin(!isLogin)}
                    className="mt-3 text-sm text-blue-600 cursor-pointer text-center"
                >
                    {isLogin ? "Need an account? Sign Up" : "Already have an account? Log In"}
                </p>
            </form>
        </div>
        </div>
    );
}
