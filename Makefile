clean:
	rm -f ./build/*.mp3
	rm -f ./build/*.png
	rm -f ./video.mp4

build:
	pkg src/index.js