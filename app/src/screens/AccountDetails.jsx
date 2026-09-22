import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { store } from "../lib/store";

const FIELDS = [
  { key: "firstName", label: "First name", required: true },
  { key: "lastName", label: "Last name", required: true },
  { key: "address1", label: "Address line 1", required: true },
  { key: "address2", label: "Address line 2", required: false },
  { key: "city", label: "City", required: true },
  { key: "region", label: "Province / county", required: false },
  { key: "postal", label: "Postal code", required: true },
  { key: "country", label: "Country", required: true },
  { key: "phone", label: "Phone number", required: false },
];

const DEFAULTS = {
  firstName: "Alexander", lastName: "K.", address1: "14 Harbor Lane", address2: "",
  city: "Monaco", region: "", postal: "98000", country: "Monaco", phone: "+377 00 00 00",
};

export default function AccountDetails() {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => store.profile || DEFAULTS);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setDirty(true);
    setSaved(false);
  };

  const save = () => {
    const e = {};
    FIELDS.filter((f) => f.required).forEach((f) => {
      if (!String(form[f.key] || "").trim()) e[f.key] = "Required";
    });
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    store.setProfile(form);
    setDirty(false);
    setSaved(true);
  };

  const back = () => {
    if (dirty && !window.confirm("Discard unsaved edits?")) return;
    navigate("/account");
  };

  return (
    <div className="px-4 pt-2 pb-4">
      <div className="flex items-center gap-3">
        <button onClick={back} aria-label="Back" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline bg-card text-fg">
          <span className="ms">arrow_back</span>
        </button>
        <h1 className="font-display text-[22px] font-bold tracking-tight text-fg">Account details</h1>
      </div>

      <div className="mt-4 space-y-3">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label htmlFor={`ad-${f.key}`} className="mb-1.5 block text-[12px] font-bold text-fg">
              {f.label} {f.required ? <span className="text-gold">*</span> : <span className="font-semibold text-faint">(optional)</span>}
            </label>
            <input
              id={`ad-${f.key}`}
              value={form[f.key] || ""}
              onChange={(e) => set(f.key, e.target.value)}
              className={`w-full rounded-xl border bg-card px-3.5 py-3 text-sm text-fg outline-none placeholder:text-faint focus:border-indigo-bright ${errors[f.key] ? "border-red-400/60" : "border-hairline"}`}
            />
            {errors[f.key] && <p className="mt-1 text-[11px] font-semibold text-red-300">{errors[f.key]}</p>}
          </div>
        ))}
      </div>

      {saved && <p className="mt-3 rounded-xl border border-teal/40 bg-teal-soft px-4 py-3 text-[12px] font-bold text-teal-pale">Details saved.</p>}

      <button onClick={save} className="mt-4 w-full rounded-xl bg-cta py-3.5 text-sm font-bold text-white active:scale-[0.98]">
        Save changes
      </button>
    </div>
  );
}
