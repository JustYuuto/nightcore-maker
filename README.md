# Nightcore Maker

A Node.js program to make a nightcore version of a music in 10 seconds

## How it works

* Asks for a YouTube video URL and download its audio
* Grabs a random wallpaper using the [r/AnimeWallpaper](https://www.reddit.com/r/AnimeWallpaper) subreddit (filter by top posts and only desktop wallpapers) and downloads it [[Why did I take a subreddit for the wallpaper?](#wallpaper)]
* Using the downloaded audio, FFmpeg will speed it up 0.25x faster
* Now that we have the faster audio (the nightcore version) and the wallpaper, we need the merge them to make a video [Not done yet]

## Run it

Download [Node.js](https://nodejs.org/en/) v16+ and [FFmpeg](https://ffmpeg.org/download.html), then run:

```bash
npm start
```

## Notes

### Why did I take a subreddit for the wallpaper?

I've search for 3h+ for an API for random anime wallpaper, I know Pixiv but this is nightmare for logging in. 1h30-2h of research, which didn't really help me because I couldn't connect to use their API... :|

Finally took the subreddit because I've had enough of these login problems