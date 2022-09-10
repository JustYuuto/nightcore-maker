# Nightcore Maker

A Node.js program to make a nightcore version of a music in 10 seconds

## How it works

* Asks for a YouTube video URL and download its audio
* Grabs a random wallpaper using the [r/AnimeWallpaper](https://www.reddit.com/r/AnimeWallpaper) subreddit (filter by top posts and only desktop wallpapers) and downloads it
* Using the downloaded audio, FFmpeg will speed it up 0.25x faster
* Now that we have the faster audio (the nightcore version) and the wallpaper, we need the merge them to make a video [Not done yet]