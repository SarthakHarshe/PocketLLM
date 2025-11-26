const fs = require('fs');
const path = require('path');
const https = require('https');

// Llama 3.2 1B Instruct Q4_K_M (Newer, smarter, same size)
const MODEL_URL = "https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf";
// Adjusted path for running inside server/scripts/
const MODELS_DIR = path.join(__dirname, '..', 'models');
const MODEL_PATH = path.join(MODELS_DIR, 'Llama-3.2-1B-Instruct-Q4_K_M.gguf');

if (!fs.existsSync(MODELS_DIR)) {
    fs.mkdirSync(MODELS_DIR, { recursive: true });
}

if (fs.existsSync(MODEL_PATH)) {
    console.log('Model already exists. Skipping download.');
    process.exit(0);
}

console.log(`Downloading model from ${MODEL_URL}...`);
console.log(`Target path: ${MODEL_PATH}`);

const file = fs.createWriteStream(MODEL_PATH);

const download = (url, dest) => {
    https.get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
            console.log(`Redirecting to ${response.headers.location}...`);
            download(response.headers.location, dest);
            return;
        }

        if (response.statusCode !== 200) {
            console.error(`Failed to download model: ${response.statusCode} ${response.statusMessage}`);
            return;
        }

        const totalSize = parseInt(response.headers['content-length'], 10);
        let downloaded = 0;

        response.pipe(dest);

        response.on('data', (chunk) => {
            downloaded += chunk.length;
            const progress = ((downloaded / totalSize) * 100).toFixed(2);
            process.stdout.write(`\rProgress: ${progress}%`);
        });

        dest.on('finish', () => {
            dest.close();
            console.log('\nDownload completed successfully!');
            console.log('You can now restart the server to use the real model.');
        });
    }).on('error', (err) => {
        fs.unlink(MODEL_PATH, () => { }); // Delete partial file
        console.error(`\nError downloading model: ${err.message}`);
    });
};

download(MODEL_URL, file);
