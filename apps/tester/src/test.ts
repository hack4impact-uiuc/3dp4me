import { readFileSync, writeFileSync } from "fs"
import { pdfToPng } from "./imgUtils"
import { exit } from "process"

const runImageTest = async () => {
    console.log('Running image test')
    const data = readFileSync("./src/dummy.pdf")
    const output = await pdfToPng(data)
    if (!output) {
        console.error("No output")
        exit(1)
    }

    await writeFileSync("./output.png", output) 
    console.log("Done")
}

runImageTest()