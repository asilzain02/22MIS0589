import axios from "axios";

const BASE_URL =
    "http://4.224.186.213/evaluation-service";

export async function Log(
    stack: string,
    level: string,
    pkg: string,
    message: string
) {

    try {

        const response = await axios.post(
            `${BASE_URL}/logs`,
            {
                stack,
                level,
                package: pkg,
                message
            },
            {
                headers: {
                    Authorization:
                        `Bearer Not Given`
                }
            }
        );

        console.log(response.data);

    }
    catch (error: any) {

        console.log(
            "Error:",
            error.response?.data || error.message
        );

    }

}