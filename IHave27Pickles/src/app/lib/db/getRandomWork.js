import { supabase } from "./supabaseClient";

export async function getRandomWork() {
    const { data, error } = await supabase
        .rpc("get_random_work");
    if (error) {
        console.log(error);
        return null;
    }

    let letterList = [];

    data.strings.forEach(s => {
        s.string_text.forEach(st => {
            letterList.push({
                x: st.x,
                y: st.y,
                letter: st.letter
            })
        })
    });

    return { workId: data.work_id, letterList, question: data.question };
}