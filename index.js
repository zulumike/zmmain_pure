import { getUserInfo } from "./scripts/auth.js";

async function getUser() {
    const userInfo = await getUserInfo();
    console.log(userInfo);
}

getUser();