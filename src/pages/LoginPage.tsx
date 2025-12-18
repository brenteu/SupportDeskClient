import { useForm } from "react-hook-form";
import { api } from "../api/http";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

type LoginForm = { email: string; password: string };
type AuthResponse = { token: string; email: string; roles: string[] };

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();
  const { setAuth } = useAuth();
  const nav = useNavigate();

  async function onSubmit(data: LoginForm) {
    const res = await api<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setAuth(res.token, res.email, res.roles);
    nav("/tickets");
  }

  return (
    <div className="card">
      <h2 className="h2">Login</h2>

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="loginEmail" className="small">Email</label>
          <input id="loginEmail" placeholder="Email" {...register("email", { required: "Email is required" })} />
          {errors.email && <div className="small error">{errors.email.message}</div>}
        </div>

        <div>
          <label htmlFor="loginPassword" className="small">Password</label>
          <input id="loginPassword" placeholder="Password" type="password" {...register("password", { required: "Password is required" })} />
          {errors.password && <div className="small error">{errors.password.message}</div>}
        </div>

        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
