import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { api } from "../api/http";
import "../styles/auth.css";
import "../styles/layout.css";

type Form = {
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
};

export default function NewTicketPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ defaultValues: { priority: "Medium" } });

  const nav = useNavigate();

  async function onSubmit(data: Form) {
    const created = await api<{ id: number }>(`/api/tickets`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    nav(`/tickets/${created.id}`);
  }

  return (
    <div className="card">
      <h2 className="h2">New Ticket</h2>

      <form className="form formWide" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="ticketTitle" className="small">
            Title
          </label>
          <input
            id="ticketTitle"
            placeholder="Title"
            {...register("title", {
              required: "Title is required",
              maxLength: { value: 120, message: "Max 120 characters" },
            })}
          />
          {errors.title && <div className="small error">{errors.title.message}</div>}
        </div>

        <div>
          <label htmlFor="ticketDesc" className="small">
            Description
          </label>
          <textarea
            id="ticketDesc"
            rows={6}
            placeholder="Describe the issue..."
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && (
            <div className="small error">{errors.description.message}</div>
          )}
        </div>

        <div>
          <label htmlFor="ticketPriority" className="small">
            Priority
          </label>
          <select id="ticketPriority" {...register("priority")}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}
