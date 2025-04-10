import { exec } from "child_process";

export async function POST() {
  try {
  exec('git pull', ()=>{
    exec('npm run build')
  })
  
  } catch (error) {
    console.error("webhook error:", error);
  }
}
