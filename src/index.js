const ytdl = require('ytdl-core');
const readline = require('readline');
const fs = require('fs');
const axios = require('axios').default;
const { exec } = require('child_process');
const { resolve } = require('path');
const ini = require('ini');

const config = ini.parse(fs.readFileSync(resolve('config.ini'), 'utf-8'));
const rl = readline.createInterface(process.stdin, process.stdout);

rl.question('→ Enter music YouTube URL: ', async (url) => {
  rl.close();
  if (!ytdl.validateURL(url)) {
    console.error('Not a valid URL!');
    process.exit();
  }
  console.log('');
  downloadAudio(url);
  downloadWallpaper();
  setTimeout(() => {
    if (fs.existsSync(resolve('build/output.mp3'))) fs.unlinkSync(resolve('build/output.mp3'));
    createNightcoreAudio();
  }, 4000);
  setTimeout(() => {
    if (fs.existsSync(resolve('video.mp4'))) fs.unlinkSync(resolve('video.mp4'));
    createNightcoreVideo();
  }, 10000);
});

function downloadAudio(url) {
  step('Downloading audio...');
  ytdl(url, {
    filter: 'audioonly'
  }).pipe(fs.createWriteStream('build/music.mp3'));
  step('Audio downloaded');
}

async function downloadWallpaper() {
  step('Downloading wallpaper...');
  const url = 'https://www.reddit.com/r/AnimeWallpaper/search.json?limit=50&sort=top&q=flair_name%3A"Desktop"';
  const posts = (await axios.get(url)).data.data.children;
  const wallpaper = posts[Math.floor(Math.random() * posts.length)].data.url;
  const res = await axios.get(wallpaper, {
    responseType: 'stream'
  });
  await res.data.pipe(fs.createWriteStream('build/wallpaper.png'));
  step('Wallpaper downloaded');
}

function createNightcoreAudio() {
  step('Generating faster audio (nightcore version)');
  const speed = config.music.speed.replaceAll(/([a-zA-Z]+)/gi, '');
  exec(`ffmpeg -i build/music.mp3 -filter:a "atempo=${speed}" -vn build/output.mp3`, (err) => {
    if (err) throw err;
    step('Faster audio generated');
  });
}

function createNightcoreVideo() {
  step('Generating video... This can take a while, please be patient :)');
  const fps = config.video.fps.replaceAll(/([a-zA-Z]+)/gi, '');
  exec(`ffmpeg -r ${fps} -loop 1 -i build/wallpaper.png -i build/output.mp3 -acodec copy -shortest -vf scale=1920:1080 video.mp4`, (err) => {
    if (err) throw err;
    step('Video generated');
  });
}

function step(step) {
  console.log(`→ ${step}`);
}