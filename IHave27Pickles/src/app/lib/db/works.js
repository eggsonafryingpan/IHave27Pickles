import { supabase } from "./supabaseClient";

export async function insertWork(strings) {
    try {
        if (strings.length === 0) {
            return null;
        }
        const work_id = crypto.randomUUID();
        const { error: workError } = await supabase
            .from("works")
            .insert([{ work_id: work_id }])
        if (workError) {
            console.log(workError);
            return null;
        }
        for (const s of strings) {
            const string_id = crypto.randomUUID();
            const { error: stringError } = await supabase
                .from("strings")
                .insert([{ work_id: work_id, string_id: string_id }])
            if (stringError) {
                console.log(stringError);
                return null;
            }

            const textStrings = s.map((st, index) => ({
                string_text_id: crypto.randomUUID(),
                string_id: string_id,
                x: st.x,
                y: st.y,
                letter: st.letter,
                index: index
            }))
            const { error: textStringError } = await supabase
                .from("string_text")
                .insert(textStrings)
            if (textStringError) {
                console.log(textStringError);
                return null;
            }
        }


        return true;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}