import { supabase } from "./supabaseClient";

export async function insertUser(userId) {
    const { data, error } = await supabase
        .from("users")
        .insert([{ user_id: userId }])
        .select();
    if (error) {
        console.log(error);
        return null;
    }
    return data;
}