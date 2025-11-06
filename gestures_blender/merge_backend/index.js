const express = require('express');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');


const app = express();
let FFMPEG_PATH = 'ffmpeg';
try {
    // prefer ffmpeg-static if present
    // eslint-disable-next-line global-require
    const ffmpegStatic = require('ffmpeg-static');
    if (ffmpegStatic) FFMPEG_PATH = ffmpegStatic;
} catch (e) {
    // ffmpeg-static not installed — will use system ffmpeg binary
}

// quick startup check for ffmpeg availability
try {
    require('child_process').execSync(`"${FFMPEG_PATH}" -version`, { stdio: 'ignore' });
} catch (err) {
    console.error(`ffmpeg not found at "${FFMPEG_PATH}". Install ffmpeg or add ffmpeg-static to package.json.`);
    process.exit(1);
}
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const PORT = 3000;

// Clips folder
const clipsPath = path.join(__dirname, "clips");

app.get("/", (req, res) => {
    res.send("Gesture video generator is running.");
});
app.get("/health", (req, res) => {
    res.send("OK");
});

// app.get("/generate", (req, res) => {
//     let text = req.query.text ;
//     console.log("Received text:", text);
//     text = text.toLowerCase().replace(/[^a-z]/g, ""); // only letters

//     if (!text) return res.status(400).send("No valid characters");

//     const tempFiles = [];

//     // Process each clip with text overlay
//     const processClip = (ch, index, callback) => {
//         const inputFile = path.join(clipsPath, ch + ".mp4");
//         const tempFile = `temp_${index}.mp4`;
//         tempFiles.push(tempFile);

//         // Overlay character text
//         const cmd = `ffmpeg -i "${inputFile}" -vf "drawtext=text='${ch.toUpperCase()}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=h-100" -codec:a copy "${tempFile}" -y`;

//         exec(cmd, (err) => {
//             if (err) {
//                 console.error(`Error processing clip for ${ch}:`, err);
//                 return callback(err);
//             }
//             callback(null);
//         });
//     };

//     // Process sequentially
//     let i = 0;
//     const next = (err) => {
//         if (err) return res.status(500).send("Error processing clips");

//         if (i < text.length) {
//             processClip(text[i], i, next);
//             i++;
//         } else {
//             // Build file_list.txt
//             const fileList = tempFiles.map(f => `file '${path.resolve(f)}'`).join("\n");
//             fs.writeFileSync("file_list.txt", fileList);

//             const outputFile = "output.mp4";
//             exec(`ffmpeg -f concat -safe 0 -i file_list.txt -vf "setpts=0.5*PTS" -af "atempo=2.0" ${outputFile}`, (err) => {
//                 if (err) {
//                     console.error("Error merging clips:", err);
//                     return res.status(500).send("Error merging clips");
//                 }

//                 res.download(outputFile, (err) => {
//                     // Clean up
//                     tempFiles.forEach(f => fs.unlinkSync(f));
//                     fs.unlinkSync("file_list.txt");
//                     fs.unlinkSync(outputFile);
//                 });
//             });
//         }
//     };

//     next();
// });

app.get("/generate", (req, res) => {
    let text = req.query.text;
    console.log("Received text:", text);
    text = text.toLowerCase().replace(/[^a-z]/g, ""); // only letters

    if (!text) return res.status(400).send("No valid characters");

    // Build file_list.txt content
    const fileList = text
        .split("")
        .map(ch => `file '${path.resolve(path.join(clipsPath, ch + ".mp4"))}'`)
        .join("\n");

    fs.writeFileSync("file_list.txt", fileList);

    const outputFile = "output.mp4";
       
    // Concatenate directly
 exec(`"${FFMPEG_PATH}" -f concat -safe 0 -i file_list.txt \
-vf "setpts=0.5*PTS" -af "atempo=2.0" \
-c:v libx264 -preset fast -crf 23 -c:a aac -b:a 192k \
${outputFile}`, (err) => {
    if (err) {
        console.error("Error merging clips:", err);
        return res.status(500).send("Error merging clips");
    }
    res.download(outputFile, () => {
        fs.unlinkSync("file_list.txt");
        fs.unlinkSync(outputFile);
    });
});
});


// app.get("/generate", (req, res) => {
//     let text = req.query.text;
//     console.log("Received text:", text);
//     text = text.toLowerCase().replace(/[^a-z]/g, ""); // only letters

//     if (!text) return res.status(400).send("No valid characters");

//     const tempFiles = [];

//     // Process each character with overlay
//     const processClip = (ch, index, callback) => {
//         const inputFile = path.join(clipsPath, ch + ".mp4");
//         const tempFile = `temp_${index}.mp4`;
//         tempFiles.push(tempFile);

//         // 👇 Your drawtext line integrated
//         const cmd = `ffmpeg -i "${inputFile}" -vf "drawtext=text='${ch.toUpperCase()}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=h-100" -codec:a copy "${tempFile}" -y`;

//         exec(cmd, (err) => {
//             if (err) {
//                 console.error(`Error processing clip for ${ch}:`, err);
//                 return callback(err);
//             }
//             callback(null);
//         });
//     };

//     // Sequential processing
//     let i = 0;
//     const next = (err) => {
//         if (err) return res.status(500).send("Error processing clips");

//         if (i < text.length) {
//             processClip(text[i], i, next);
//             i++;
//         } else {
//             // Build concat list
//             const fileList = tempFiles.map(f => `file '${path.resolve(f)}'`).join("\n");
//             fs.writeFileSync("file_list.txt", fileList);

//             const outputFile = "output.mp4";

//             // Concatenate with speed up
//             exec(`ffmpeg -f concat -safe 0 -i file_list.txt -vf "setpts=0.5*PTS" -af "atempo=2.0" ${outputFile}`, (err) => {
//                 if (err) {
//                     console.error("Error merging clips:", err);
//                     return res.status(500).send("Error merging clips");
//                 }

//                 res.download(outputFile, () => {
//                     // Cleanup
//                     tempFiles.forEach(f => fs.unlinkSync(f));
//                     fs.unlinkSync("file_list.txt");
//                     fs.unlinkSync(outputFile);
//                 });
//             });
//         }
//     };

//     next();
// });

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));