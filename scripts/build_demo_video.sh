#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/ubuntu/kamran"
REFS="$ROOT/media/references"
OUT="$ROOT/media"
WORK="$OUT/demo-clips"
FONT="/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf"
mkdir -p "$WORK"
rm -f "$WORK"/*.mp4 "$WORK"/concat.txt "$OUT/kamran-product-demo.mp4"

# Authentic KAMRAN preview frames are padded to landscape canvases before this script runs.
# Each scene repeats a real screen, adds a gentle zoom, and uses a concise explanatory callout.
make_scene() {
  local name="$1"
  local image="$2"
  local duration="$3"
  local label="$4"
  local zoom="$5"
  local fade_start
  fade_start=$(awk "BEGIN { printf \"%.2f\", $duration - 0.55 }")
  ffmpeg -hide_banner -loglevel error -y \
    -loop 1 -i "$REFS/$image-16x9.png" \
    -vf "scale=1280:720,zoompan=z='min(zoom+$zoom,1.045)':d=1:s=1280x720:fps=30,format=yuv420p,drawbox=x=42:y=622:w=1196:h=54:color=0x0f1b2dcc:t=fill,drawtext=fontfile=$FONT:text='$label':fontcolor=white:fontsize=24:x=70:y=638:enable='between(t,0.15,$duration)',fade=t=in:st=0:d=0.55,fade=t=out:st=$fade_start:d=0.55" \
    -t "$duration" -r 30 -an -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p "$WORK/$name.mp4"
  printf "file '%s'\n" "$WORK/$name.mp4" >> "$WORK/concat.txt"
}

: > "$WORK/concat.txt"
make_scene "01-onboarding" "onboarding" 8 "KAMRAN · Uyghur ↔ Chinese" 0.0008
make_scene "02-home" "home" 10 "Speak freely · Everyday translation" 0.0007
make_scene "03-translate" "translate" 12 "Text translation · Clear results" 0.0008
make_scene "04-voice" "translate" 10 "Voice input · Listen back" 0.0009
make_scene "05-ocr" "ocr" 12 "Camera OCR · Review before translating" 0.0007
make_scene "06-learn" "learn" 12 "Learn the context · Vocabulary and culture" 0.0007
make_scene "07-lesson" "lesson" 8 "Twelve Muqam · Sound, place, community" 0.0008
make_scene "08-history" "history" 8 "History · Favorites · Local phrasebook" 0.0009
make_scene "09-settings" "settings" 8 "Built for everyday conversations" 0.0007

ffmpeg -hide_banner -loglevel error -y \
  -f concat -safe 0 -i "$WORK/concat.txt" \
  -f lavfi -i "anullsrc=channel_layout=stereo:sample_rate=48000" \
  -t 88 -c:v copy -c:a aac -b:a 96k -shortest -movflags +faststart \
  "$OUT/kamran-product-demo.mp4"

ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,avg_frame_rate -of default=noprint_wrappers=1 "$OUT/kamran-product-demo.mp4"
