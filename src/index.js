const ytdl = require('ytdl-core');
const fs = require('fs');
const axios = require('axios').default;
const { exec } = require('child_process');
const { resolve } = require('path');
const { program } = require('commander');

if (!fs.existsSync(resolve(process.cwd(), 'build'))) fs.mkdirSync(resolve(process.cwd(), 'build'));

program
  .name('nightcore-maker')
  .description('A Node.js program to make a nightcore version of a music in 10 seconds ')
  .version(require('../package.json').version);

program
  .argument('video', 'Video URL')
  .option('-s, --speed <speed>', 'speed of the new audio', 1.25)
  .option('-f, --fps <fps>', 'fps of the video', 25)
  .action((url, options) => {
    if (!ytdl.validateURL(url)) {
      console.error('Not a valid URL!');
      process.exit(1);
    }
    downloadAudio(url);
    downloadWallpaper();
    if (fs.existsSync(resolve('build/music.mp3'))) fs.unlinkSync(resolve('build/music.mp3'));
    if (fs.existsSync(resolve('build/output.mp3'))) fs.unlinkSync(resolve('build/output.mp3'));
    if (fs.existsSync(resolve('video.mp4'))) fs.unlinkSync(resolve('video.mp4'));
    setTimeout(() => createNightcoreAudio(options.speed), 4000);
    setTimeout(() => {
      createNightcoreVideo(options.fps);
      exec('exit');
    }, 10000);
  });
  ;

program.parse();

function downloadAudio(url) {
  step('Downloading audio...');
  ytdl(url, {
    filter: 'audioonly'
  }).pipe(fs.createWriteStream(resolve(process.cwd(), 'build', 'music.mp3')));
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

function createNightcoreAudio(speed) {
  step('Generating faster audio (nightcore version)');
  exec(`ffmpeg -i build/music.mp3 -filter:a "atempo=${speed}" -vn build/output.mp3`, (err) => {
    if (err) throw err;
    step('Faster audio generated');
  });
}

function createNightcoreVideo(fps) {
  step('Generating video... This can take a while, please be patient :)');
  exec(`ffmpeg -r ${fps} -loop 1 -i build/wallpaper.png -i build/output.mp3 -acodec copy -shortest -vf scale=1920:1080 video.mp4`, (err) => {
    if (err) throw err;
    step('Video generated');
  });
}

function step(step) {
  console.log(`→ ${step}`);
}