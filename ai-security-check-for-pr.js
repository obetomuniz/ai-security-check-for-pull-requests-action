const fs = require("fs")
const path = require("path")
const axios = require("axios")

const OPEN_AI_MODEL = "gpt-3.5-turbo"
const OPENAI_API = axios.create({
  baseURL: "https://api.openai.com/v1/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_TOKEN}`,
  },
})
const GH_API = axios.create({
  baseURL: "https://api.github.com/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.GH_TOKEN}`,
  },
})

async function analyzeCode(code) {
  try {
    const prompt = `Analyze the following code snippet for security and privacy issues using GPT-3.5-turbo:\n\nCode:\n${code}\n\nIssues:\n`
    const response = await OPENAI_API.post("chat/completions", {
      model: OPEN_AI_MODEL,
      messages: [
        {
          role: "system",
          content: `You're a helpful web developer looking for security and privacy issues in a code.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.5,
    })

    return response.data.choices[0].message?.content.trim() || ""
  } catch (error) {
    console.error("Error analyzing code:", error)
    throw error
  }
}

function readFiles(files) {
  let code = ""

  files.forEach((file) => {
    const filePath = path.join(process.cwd(), file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      console.error(
        "Error: Directories are not supported. Please provide a list of changed files."
      )
      process.exit(1)
    } else {
      code += fs.readFileSync(filePath, "utf-8") + "\n"
    }
  })

  return code
}

;(async () => {
  try {
    const prFilesResponse = await GH_API.get(
      `repos/${process.env.GH_REPOSITORY}/pulls/${process.env.GH_EVENT_PULL_REQUEST_NUMBER}/files`
    )
    const changedFiles = prFilesResponse.data.map((file) => file.filename)
    const code = readFiles(changedFiles)
    const issues = await analyzeCode(code)

    if (issues) {
      console.log(base64Encode(`Issues Found:`, issues))
      process.env.PR_COMMENT = `## Security and Privacy Suggestions\n\n${issues}`
    } else {
      console.log("No security or privacy issues found.")
    }
  } catch (error) {
    console.error("Error during code analysis:", error)
    process.exit(1)
  }
})()
