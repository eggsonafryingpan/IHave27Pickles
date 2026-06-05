import { supabase } from "./supabaseClient";

export async function getRandomQuestion() {
    const { data, error } = await supabase.rpc("get_random_question");
    if (error) {
        console.log(error);
        return null;
    }

    return { question: data.question, id: data.question_id };
}