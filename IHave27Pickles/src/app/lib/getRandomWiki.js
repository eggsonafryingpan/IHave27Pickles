import axios from "axios";

export async function getRandomWikiTitle() {
    const response = await axios.get("https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=1&format=json&origin=*");

    const title = response.data.query.random[0].title;

    const article = await axios.get("/api/wiki?url=" + "https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(title))

    return { data: article.data, title };
}