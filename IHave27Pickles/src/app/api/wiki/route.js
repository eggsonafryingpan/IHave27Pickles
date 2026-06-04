import axios from "axios";
import fs from "fs";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    let cache;
    try {
        let file = fs.readFileSync(process.cwd() + "/cache.json", "utf-8");
        cache = file ? JSON.parse(file) : {};
    } catch {
        cache = {};
    }

    if (cache[url]) {
        return Response.json(cache[url]);
    }

    const response = await axios.get(url, {
        headers: {
            "User-Agent":
                "WikiScrapingTest/1.0 (educational use)",
        },
    });
    cache[url] = response.data;

    // await new Promise(r => setTimeout(r, 1000)); PLEASE DO IT SLOW
    fs.writeFileSync(process.cwd() + "/cache.json", JSON.stringify(cache, null, 2));
    return Response.json(response.data);
}
