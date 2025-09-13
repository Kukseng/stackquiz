"use client";
import { useGetCategoriesQuery, useCreateCategoryMutation } from "@/lib/api/categoryApi";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";

export default function CategoryComponent() {
  const { data: session, status } = useSession();
  const isAuthed = status === "authenticated" && !!(session as any)?.apiAccessToken;

  const { data: categories, isLoading } = useGetCategoriesQuery(undefined, {
    skip: !isAuthed,  // don't call until we have a token
  });

  const [createCategory] = useCreateCategoryMutation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!isAuthed) {
      await signIn(); // trigger login if somehow not signed in
      return;
    }
    try {
      await createCategory({ name, description }).unwrap();
      alert("Created!");
      setName(""); setDescription("");
    } catch (e) {
      console.error("Failed to create category:", e);
      alert("Create failed");
    }
  };

  if (!isAuthed) return <p>Signing in…</p>;
  if (isLoading) return <p>Loading…</p>;

  return (
    <div>
      <h1>Categories</h1>
      <ul>{categories?.map((c) => <li key={c.id}>{c.name}</li>)}</ul>

      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <button onClick={handleCreate}>Create Category</button>
    </div>
  );
}
