"use client";

import { useActionState, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { FieldSpec, SectionSpec, SectionValue } from "@/lib/content/schema";
import { saveContentAction, type ContentFormState } from "@/app/admin/_actions/content";
import { SubmitButton } from "./submit-button";
import { helpClass, inputClass, labelClass } from "./form-styles";
import { cn } from "@/lib/utils";

function Input({
  spec,
  id,
  name,
  value,
  defaultValue,
  onChange,
}: {
  spec: FieldSpec;
  id: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
}) {
  const common = {
    id,
    name,
    maxLength: spec.max,
    required: spec.required,
    value,
    defaultValue,
    onChange: onChange ? (e: { target: { value: string } }) => onChange(e.target.value) : undefined,
    "aria-describedby": spec.help ? `${id}-help` : undefined,
  };
  if (spec.kind === "textarea") {
    return <textarea {...common} rows={spec.max > 600 ? 10 : spec.max > 200 ? 4 : 2} className={cn(inputClass, "resize-y")} />;
  }
  return (
    <input
      {...common}
      type={spec.kind === "email" ? "email" : spec.kind === "url" ? "url" : "text"}
      inputMode={spec.kind === "url" ? "url" : undefined}
      className={inputClass}
    />
  );
}

export function SectionForm({ spec, value, isStored }: { spec: SectionSpec; value: SectionValue; isStored: boolean }) {
  const [state, action] = useActionState<ContentFormState, FormData>(saveContentAction, {});
  const [items, setItems] = useState<Record<string, string>[]>(value.items);
  const list = spec.list;

  const update = (i: number, key: string, v: string) =>
    setItems((prev) => prev.map((item, j) => (j === i ? { ...item, [key]: v } : item)));
  const move = (i: number, d: -1 | 1) =>
    setItems((prev) => {
      const next = [...prev];
      [next[i], next[i + d]] = [next[i + d], next[i]];
      return next;
    });

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="section" value={spec.key} />
      {list ? <input type="hidden" name="items" value={JSON.stringify(items)} /> : null}

      {spec.fields.map((f) => (
        <div key={f.key} className="flex flex-col gap-1.5">
          <label htmlFor={`${spec.key}-${f.key}`} className={labelClass}>
            {f.label}
            {f.required ? " *" : ""}
          </label>
          <Input spec={f} id={`${spec.key}-${f.key}`} name={`field.${f.key}`} defaultValue={value.fields[f.key] ?? ""} />
          {f.help ? (
            <p id={`${spec.key}-${f.key}-help`} className={helpClass}>
              {f.help}
            </p>
          ) : null}
        </div>
      ))}

      {list ? (
        <fieldset className="flex flex-col gap-3">
          <legend className={cn(labelClass, "mb-2")}>
            {list.label} ({items.length}/{list.maxItems})
          </legend>
          {items.length === 0 ? <p className={helpClass}>None yet — this section is hidden on the site while empty.</p> : null}
          {items.map((item, i) => (
            <div key={i} className="rounded-xl border border-border-subtle bg-white/[0.02] p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-dim">
                  {list.itemLabel} {i + 1}
                </span>
                <div className="flex gap-1">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${list.itemLabel.toLowerCase()} ${i + 1} up`} className="focus-ring rounded-md p-1.5 text-muted hover:text-foreground disabled:opacity-30">
                    <ArrowUp size={14} />
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`Move ${list.itemLabel.toLowerCase()} ${i + 1} down`} className="focus-ring rounded-md p-1.5 text-muted hover:text-foreground disabled:opacity-30">
                    <ArrowDown size={14} />
                  </button>
                  <button type="button" onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))} aria-label={`Remove ${list.itemLabel.toLowerCase()} ${i + 1}`} className="focus-ring rounded-md p-1.5 text-muted hover:text-red-300">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className={cn("grid gap-3", list.fields.length > 2 ? "sm:grid-cols-2" : "")}>
                {list.fields.map((f) => (
                  <div key={f.key} className={cn("flex flex-col gap-1.5", f.kind === "textarea" && list.fields.length > 2 && "sm:col-span-2")}>
                    <label htmlFor={`${spec.key}-${i}-${f.key}`} className={labelClass}>
                      {f.label}
                      {f.required ? " *" : ""}
                    </label>
                    <Input spec={f} id={`${spec.key}-${i}-${f.key}`} value={item[f.key] ?? ""} onChange={(v) => update(i, f.key, v)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          {items.length < list.maxItems ? (
            <button
              type="button"
              onClick={() => setItems((prev) => [...prev, Object.fromEntries(list.fields.map((f) => [f.key, ""]))])}
              className="focus-ring inline-flex w-fit items-center gap-1.5 rounded-lg border border-dashed border-border-strong px-3 py-2 text-sm text-muted hover:text-foreground"
            >
              <Plus size={14} /> Add {list.itemLabel.toLowerCase()}
            </button>
          ) : null}
        </fieldset>
      ) : null}

      {state.errors?.length ? (
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          <ul className="list-disc pl-4">
            {state.errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>Save {spec.title.toLowerCase()}</SubmitButton>
        <p className={helpClass} role="status">
          {state.ok ? "Saved — the public site has been refreshed." : isStored ? "Using your saved version." : "Showing the built-in default."}
        </p>
      </div>
    </form>
  );
}
