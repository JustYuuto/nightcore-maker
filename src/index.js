const ytdl = require('ytdl-core');
const readline = require('readline');
const fs = require('fs');
const axios = require('axios').default;
const { exec } = require('child_process');
const { resolve } = require('path');

const rl = readline.createInterface(process.stdin, process.stdout);

rl.question('Enter music YouTube URL: ', async (url) => {
  rl.close();
  if (!ytdl.validateURL(url)) {
    console.error('Not a valid URL!');
    process.exit();
  }
  downloadAudio(url);
  downloadWallpaper();
  setTimeout(() => {
    if (fs.existsSync(resolve('build/output.mp3'))) fs.unlinkSync(resolve('build/output.mp3'));
    createNightcoreAudio();
  }, 4000);
});

function downloadAudio(url) {
  ytdl(url, {
    filter: 'audioonly'
  }).pipe(fs.createWriteStream('build/music.mp3'));
}

async function downloadWallpaper() {
  const url = 'https://www.reddit.com/r/AnimeWallpaper/search.json?limit=50&sort=top&q=flair_name%3A"Desktop"';
  const posts = (await axios.get(url)).data.data.children;
  const wallpaper = posts[Math.floor(Math.random() * posts.length)].data.url;
  const res = await axios.get(wallpaper, {
    responseType: 'stream'
  });
  await res.data.pipe(fs.createWriteStream('build/wallpaper.png'));
}

function createNightcoreAudio() {
  exec('ffmpeg -i build/music.mp3 -filter:a "atempo=1.25" -vn build/output.mp3', (err) => {
    if (err) throw err;
  });
}

function createNightcoreVideo() {}