import { supabase } from "./supabaseClient";

// Universities API
export const getUniversities = async (name = null) => {
  let query = supabase.from("universities").select("*");

  if (name) {
    query = query.ilike("name", `%${name}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getUniversityById = async (id) => {
  const { data, error } = await supabase
    .from("universities")
    .select("*")
    .eq("universityid", id)
    .single();

  if (error) throw error;
  return data;
};

// Ratings API
export const getRatings = async (universityId) => {
  const { data, error } = await supabase
    .from("rating")
    .select("*")
    .eq("universityid", universityId);

  if (error) throw error;
  return data;
};

export const getStudentRatings = async (studentId) => {
  const { data, error } = await supabase
    .from("rating")
    .select("*")
    .eq("studentid", studentId);

  if (error) throw error;
  return data;
};

export const createRating = async (ratingData) => {
  // Destructure to ensure we're only sending the required fields
  const {
    universityid,
    studentid,
    ratingcomment,
    studentlife,
    classesteachers,
    cost,
    returnoninvestment,
    diningfood,
    dormshousing,
    healthsafety,
    citysetting,
  } = ratingData;

  const dataToSubmit = {
    universityid,
    studentid,
    ratingcomment,
    studentlife,
    classesteachers,
    cost,
    returnoninvestment,
    diningfood,
    dormshousing,
    healthsafety,
    citysetting,
  };

  const { data, error } = await supabase
    .from("rating")
    .insert([dataToSubmit])
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(error.message || "Failed to create rating");
  }
  return data;
};

export const updateRating = async (ratingId, updatedComment) => {
  const { data, error } = await supabase
    .from("rating")
    .update({ ratingcomment: updatedComment })
    .eq("ratingid", ratingId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteRating = async (ratingId) => {
  const { error } = await supabase
    .from("rating")
    .delete()
    .eq("ratingid", ratingId);

  if (error) throw error;
};

// Category (Averages) API
export const getUniversityAverages = async (universityId) => {
  const { data, error } = await supabase
    .from("category")
    .select("*")
    .eq("universityid", universityId)
    .single();

  if (error) throw error;
  return data;
};

// Facilities API
export const getFacilities = async () => {
  const { data, error } = await supabase
    .from("universityfacilities")
    .select("*");

  if (error) throw error;
  return data;
};

// Students API
export const getStudents = async () => {
  const { data, error } = await supabase.from("students").select("*");

  if (error) throw error;
  return data;
};

// New function to update category averages
export const updateCategoryAverages = async (universityId, averages) => {
  const { data, error } = await supabase
    .from("category")
    .upsert({
      universityid: universityId,
      avgstudentlife: averages.studentlife,
      avgclassesteachers: averages.classesteachers,
      avgcost: averages.cost,
      avgreturnoninvestment: averages.returnoninvestment,
      avgdiningfood: averages.diningfood,
      avgdormshousing: averages.dormshousing,
      avghealthsafety: averages.healthsafety,
      avgcitysetting: averages.citysetting,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
