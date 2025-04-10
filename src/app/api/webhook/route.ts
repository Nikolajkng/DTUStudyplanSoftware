import { exec } from "child_process";
import { NextResponse } from "next/server";


export function POST() {
    console.log("webhook triggered");
    try {
        exec('git pull', (err) => {
            if (err) {
                console.log("git pull err", err)
                return
            }
            console.log("git pull success");
            exec('npm run build', (err) => {
                if (err) {
                    console.log("build err", err)
                } else {
                    console.log("build success");
                }

            })
        });

    } catch (error) {
        console.error("webhook error:", error);
    }

    return NextResponse.json({ message: "success" });
}
