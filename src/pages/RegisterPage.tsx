import { useForm } from "react-hook-form";
import { api } from "../api/http";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import "../styles/layout.css";

type Form = { email: string; password: string };
type AuthResponse = { token: string; email: string; roles: string[] };

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>();

  const { setAuth } = useAuth();
  const nav = useNavigate();

  async function onSubmit(data: Form) {
    const res = await api<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setAuth(res.token, res.email, res.roles);
    nav("/tickets");
  }

  return (
    <div className="card">
      <h2 className="h2">Register</h2>

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="registerEmail" className="small">
            Email
          </label>
          <input
            id="registerEmail"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <div className="small error">{errors.email.message}</div>}
        </div>

        <div>
          <label htmlFor="registerPassword" className="small">
            Password
          </label>
          <input
            id="registerPassword"
            placeholder="Password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Min 6 characters" },
            })}
          />
          {errors.password && <div className="small error">{errors.password.message}</div>}
        </div>

        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
