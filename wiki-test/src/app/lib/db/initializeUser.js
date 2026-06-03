import { insertUser } from "./users";

export const initalizeUser = () => {
    const hasRun = sessionStorage.getItem("initDone");

    if (hasRun) return;

    let userId = localStorage.getItem("userId");
    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem("userId", userId);
        insertUser(userId);
    }
    sessionStorage.setItem("initDone", "true");
}