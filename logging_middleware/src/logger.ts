import axios from "axios";

const BASE_URL =
    "http://4.224.186.213/evaluation-service";

export async function Log(
    stack: string,
    level: string,
    pkg: string,
    message: string
) {
    //     "clientID": "23d15025-f734-4f9c-bb88-43447e6c3cc1",
    // "clientSecret": "BbkxaHzhKZcTWVDY"

    //  "token_type": "Bearer",
    // "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhc2lsLnphaW4yMDIyQHZpdHN0dWRlbnQuYWMuaW4iLCJleHAiOjE3Nzg5MzM5NjMsImlhdCI6MTc3ODkzMzA2MywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImFmMjA5NTYyLTcxMmItNGM5YS04OTk4LTZjNThkOTFmOTg5NyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFzaWwgemFpbiB0IGEiLCJzdWIiOiIyM2QxNTAyNS1mNzM0LTRmOWMtYmI4OC00MzQ0N2U2YzNjYzEifSwiZW1haWwiOiJhc2lsLnphaW4yMDIyQHZpdHN0dWRlbnQuYWMuaW4iLCJuYW1lIjoiYXNpbCB6YWluIHQgYSIsInJvbGxObyI6IjIybWlzMDU4OSIsImFjY2Vzc0NvZGUiOiJTZkZ1V2ciLCJjbGllbnRJRCI6IjIzZDE1MDI1LWY3MzQtNGY5Yy1iYjg4LTQzNDQ3ZTZjM2NjMSIsImNsaWVudFNlY3JldCI6IkJia3hhSHpoS1pjVFdWRFkifQ.u4t-iRZqrNToWsizyxkDA_i0MhrrX7vgTYmn-5q5DYw",
    // "expires_in": 1778933963

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
                        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhc2lsLnphaW4yMDIyQHZpdHN0dWRlbnQuYWMuaW4iLCJleHAiOjE3Nzg5MzM5NjMsImlhdCI6MTc3ODkzMzA2MywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImFmMjA5NTYyLTcxMmItNGM5YS04OTk4LTZjNThkOTFmOTg5NyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFzaWwgemFpbiB0IGEiLCJzdWIiOiIyM2QxNTAyNS1mNzM0LTRmOWMtYmI4OC00MzQ0N2U2YzNjYzEifSwiZW1haWwiOiJhc2lsLnphaW4yMDIyQHZpdHN0dWRlbnQuYWMuaW4iLCJuYW1lIjoiYXNpbCB6YWluIHQgYSIsInJvbGxObyI6IjIybWlzMDU4OSIsImFjY2Vzc0NvZGUiOiJTZkZ1V2ciLCJjbGllbnRJRCI6IjIzZDE1MDI1LWY3MzQtNGY5Yy1iYjg4LTQzNDQ3ZTZjM2NjMSIsImNsaWVudFNlY3JldCI6IkJia3hhSHpoS1pjVFdWRFkifQ.u4t-iRZqrNToWsizyxkDA_i0MhrrX7vgTYmn-5q5DYw`
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