import './auth_setup.js'; // MUST be first: ensures GOOGLE_APPLICATION_CREDENTIALS is set before Google libs load
import express from 'express';
import multer from 'multer';
import path, { format } from 'path';
import dotenv from 'dotenv';
import { transcribeWithGemini } from './ai-support.js';
import { uploadToGCS } from './storage_gcs.js';
import { toASLGlossGemini } from './gemini_client.js';
import youtubedl from 'youtube-dl-exec';
import cors from 'cors';
import { fileURLToPath } from 'url';
import ytdl from "ytdl-core";
import fs from 'fs';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

const storage = multer.diskStorage({
    destination:function (req, file, cb){
        cb(null, "uploads");
    },
    filename: function(req, file, cb){
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname);
        cb(null, `${name}-${Date.now()}${ext}`);
    }
});
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const upload = multer({storage});
app.get('/', (req, res) => {
    res.send(`Hello from Express on port ${PORT}`);
});

app.get('/yt',async (req, res)=>{
    console.log("yt api called ");
    const videoUrl = req.query.url;
     if (!videoUrl) {
    return res.status(400).send("Missing ?url= parameter");
}

const outputPath = path.join(__dirname, "downloads", "%(title)s.%(ext)s");
try {
    // call the packaged binary via the npm wrapper
   const fs = await import('fs');
    const cookiesPath = path.join(__dirname, 'cookies.txt');

    const ytdlOptions = {
      format: 'bv*+ba/b',
      mergeOutputFormat: 'mp4',
      output: outputPath,
      print: 'after_move:filepath'
    };

    if (fs.existsSync(cookiesPath)) {
      ytdlOptions.cookies = cookiesPath; // youtube-dl accepts a cookies file via --cookies
      console.log(`Using cookies from ${cookiesPath}`);
    } else {
      console.warn(`cookies.txt not found at ${cookiesPath}; proceeding without cookies`);
    }

    const stdout = await youtubedl(videoUrl, ytdlOptions);
    const pathOut = (typeof stdout === 'string' ? stdout.trim().split("\n").pop() : null) || extractFilePath(String(stdout || ''));
    if (!pathOut) {
      console.error("❌ Could not determine downloaded file path from youtube-dl output:", stdout);
      return res.status(500).send("Download succeeded but final filepath not found");
    }
    console.log("✅ Final downloaded file:", pathOut);

    const finalPath = pathOut;
    const ans = await transcript(finalPath);
    console.log(ans);
    console.log("transcription done");
    res.json({ response: ans });

    try {
  await fs.promises.unlink(finalPath);
  console.log(`🧹 Deleted downloaded file: ${finalPath}`);
} catch (err) {
  console.warn(`⚠️ Failed to delete downloaded file: ${finalPath}`, err.message);
}

} catch (error) {
    console.log("error in yt-dlp exec : ", error);
    res.status(500).send("Download failed");
}
})
// app.get('/yt', async (req, res) => {
//     const videoUrl = req.query.url;

//     if (!videoUrl) {
//         return res.status(400).send("❌ Missing ?url= parameter. Please provide a YouTube URL.");
//     }

//     const downloadDir = path.join(__dirname, "downloads");
//     // Ensure the downloads directory exists
//     if (!fs.existsSync(downloadDir)) {
//         fs.mkdirSync(downloadDir, { recursive: true });
//     }
    
//     // Output path template
//     const outputPath = path.join(downloadDir, "%(title)s.%(ext)s");

//     try {
//         const ytdlOptions = {
//             // Standard recommended format for quality and compatibility
//             format: 'bestvideo+bestaudio/best', 
//             // Force merging into MP4
//             mergeOutputFormat: 'mp4',
//             output: outputPath,
//             // Keep verbose for debugging if needed, but remove once stable
//             verbose: true, 
//             addHeader: [
//                 // Use a standard browser User-Agent
//                 "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
//                 "Accept-Language: en-US,en;q=0.9"
//             ],
//             // **FIX 1: Removed problematic extractorArgs**
//             // **FIX 2: Removed cookies option for public videos**
//             geoBypass: true,
//             // This flag is crucial for getting the final file path back
//             print: 'after_move:filepath' 
//         };

//         console.log(`Attempting to download: ${videoUrl}`);

//         const stdout = await youtubedl(videoUrl, ytdlOptions);

//         const pathOut = extractFilePath(String(stdout || ''));
        
//         if (!pathOut) {
//             console.error("❌ Could not determine downloaded file path from yt-dlp output:", stdout);
//             return res.status(500).send("Download succeeded but final filepath not found.");
//         }
        
//         console.log("✅ Final downloaded file:", pathOut);
        
//         const finalPath = pathOut;

//         // --- Your Transcription Logic ---
//         // Assuming your 'transcript' function processes the file at finalPath
//         // const ans = await transcript(finalPath);
//         // console.log("Transcription done");
//         // res.json({ response: ans });
        
//         // TEMPORARY RESPONSE: Return the file path to confirm success
//         res.json({ 
//             status: "Download Successful", 
//             filepath: finalPath,
//             video: videoUrl 
//         });


//     } catch (error) {
//         // --- IMPROVED ERROR LOGGING ---
//         console.error("❌ Error in yt-dlp execution:", error.message);
//         let errorDetails = "Download failed.";

//         if (error.stderr) {
//             // Extract the final, crucial error line from yt-dlp's stderr
//             const finalError = error.stderr.split('\n').filter(line => line.startsWith('ERROR:')).pop();
//             errorDetails = finalError || error.message;
//             console.error("yt-dlp stderr:", finalError || error.stderr);
//         }
        
//         res.status(500).json({ error: errorDetails });
//     }
// });
app.post("/transcribe", upload.single('video'), async (req, res)=>{
    try {
      
        const videoPath = req.file.path;
       
       console.log("transcript called");
        const response =await transcript(videoPath)
        console.log("transcription done : ", response);
        res.json({response})
        try {
  await fs.promises.unlink(videoPath);
  console.log(`🧹 Deleted uploaded file: ${videoPath}`);
} catch (err) {
  console.warn(`⚠️ Failed to delete uploaded file: ${videoPath}`, err.message);
}
   // ye aaj 17 sep ko night me 2:10 pr working h 

} catch (error) {
        console.log("error : ", error);
        res.json({error});
    }
})

app.get("/download", async (req, res) => {
  try {
    const videoUrl = req.query.url;
    if (!videoUrl) {
      return res.status(400).send("❌ Missing 'url' query parameter.");
    }

    // Validate URL
    const isValid = ytdl.validateURL(videoUrl);
    if (!isValid) {
      return res.status(400).send("❌ Invalid YouTube URL.");
    }

    // Get video info
    const info = await ytdl.getInfo(videoUrl);
    const title = info.videoDetails.title
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "_");

    // Set headers for download
    res.header("Content-Disposition", `attachment; filename="${title}.mp4"`);
    res.header("Content-Type", "video/mp4");

    // Stream video to client
    ytdl(videoUrl, {
      quality: "highestvideo",
      filter: "audioandvideo",
    }).pipe(res);
  } catch (err) {
    console.error("❌ Download error:", err.message);
    res.status(500).send("Internal Server Error: " + err.message);
  }
});

async function transcript(videoPath) {
    const originalName = videoPath.split("/").pop().split("-")[0];
    console.log("original name is :", originalName);
     const gcsUri  = await uploadToGCS("video_to_text_bucket_samadhan_sistec",videoPath,originalName);
     console.log("gcs uri is : ", gcsUri);
    if(!gcsUri) {
        throw new Error("GCS upload failed");
    }
     const response = await transcribeWithGemini(process.env.GOOGLE_PROJECT_ID,process.env.GOOGLE_CLOUD_LOCATION,gcsUri)
    console.log("done");    
    return response;
}
function extractFilePath(logLine) {
  let match;

  // Case 1: "Deleting original file ..."
  match = logLine.match(/Deleting original file (.+?) \(pass/);
  if (match) return match[1].trim();

  // Case 2: "[download] ... has already been downloaded"
  match = logLine.match(/\[download\]\s+(.+?)\s+has already been downloaded/);
  if (match) return match[1].trim();

  return null; // no path found
}


app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});