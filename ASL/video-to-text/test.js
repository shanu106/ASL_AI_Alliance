import express from 'express';
import ytdl from '@distube/ytdl-core';
import fs from 'fs';
const app = express();
const router = express.Router();
router.get('/', async function (req, res) {
    console.log('router called');
    const url = "https://youtu.be/jCVjudmnByk?si=ypidp8il-1biPDRf";

    try {
        const outputPath = 'videos.mp4';
        const videoStream = ytdl(url, {
            quality: 'highest',
            filter: 'audioandvideo',
            highWaterMark: 1 << 25
        });

        const file = fs.createWriteStream(outputPath);
        videoStream.pipe(file);

        file.on('finish', () => {
            console.log('✅ Download completed');
            res.status(200).send('Download completed and saved as ' + outputPath);
        });

        videoStream.on('error', (err) => {
            console.error('❌ Stream error:', err);
            res.status(500).send('Download failed: ' + err.message);
        });

        file.on('error', (err) => {
            console.error('❌ File write error:', err);
            res.status(500).send('File write failed: ' + err.message);
        });
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).send('Download failed: ' + error.message);
    }
});
app.use(router);
app.listen(2222, () => {
    console.log('app listingin on 2222')
})
