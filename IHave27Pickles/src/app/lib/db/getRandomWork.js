import { supabase } from "./supabaseClient";

export async function getRandomWork() {
    const { data, error } = await supabase
        .rpc("get_random_work");
    if (error) {
        console.log(error);
        return null;
    }
    return data;
}