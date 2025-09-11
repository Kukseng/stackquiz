"use client";
import React, { useState } from "react";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
} from "@/lib/"; // adjust import path

const CategoryTest: React.FC = () => {
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!name) return;
    try {
      await createCategory({ name, description }).unwrap();
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Failed to create category:", err);
    }
  };

  if (isLoading) return <p>Loading categories...</p>;
  if (isError) return <p>Error loading categories</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Categories</h1>

      <ul className="list-disc pl-5 mb-4">
        {categories?.map((cat) => (
          <li key={cat.id}>
            <strong>{cat.name}</strong>: {cat.description}
          </li>
        ))}
      </ul>

      <div className="space-y-2">
        <input
          className="border p-2 rounded w-full"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleCreate}
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Add Category"}
        </button>
      </div>
    </div>
  );
};

export default CategoryTest;
