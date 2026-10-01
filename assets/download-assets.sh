#!/usr/bin/env bash
# Downloads every Higgsfield asset used by LIGTAS into this assets/ folder.
# Run from the project root:  bash assets/download-assets.sh
set -e
cd "$(dirname "$0")"
B="https://d8j0ntlcm91z4.cloudfront.net/user_3K0CFOcn2VlzDLUUHyafEalBaqJ"
mkdir -p img video model
curl -L -o video/hero-loop.mp4        "$B/hf_20260930_141916_08df2f31-06c3-4b21-8cbf-06f6aacb62d0.mp4"
curl -L -o video/dots-shield.mp4      "$B/hf_20260930_141916_a2502433-7e54-486a-815b-873c17455a00.mp4"
curl -L -o img/commuters-16x9.png     "$B/hf_20260930_141904_c76a0077-7aaf-438a-8312-f5897e2995a0.png"
curl -L -o img/commuters-1x1.png      "$B/hf_20260930_142146_719dc449-29f3-417d-9a9b-eeac91697c86.png"
curl -L -o img/phone-16x9.png         "$B/hf_20260930_141904_85591d06-85c8-4448-a039-d7ec8abc2799.png"
curl -L -o img/phone-1x1.png          "$B/hf_20260930_142150_618f41f6-d692-45a2-a72a-d86505b391a0.png"
curl -L -o img/solidarity-16x9.png    "$B/hf_20260930_141904_f092f28c-be2a-460f-b546-f67af13360e6.png"
curl -L -o img/solidarity-1x1.png     "$B/hf_20260930_142155_04a880d9-078c-479c-b3f6-296394152929.png"
curl -L -o img/safe-space-16x9.png    "$B/hf_20260930_141905_5930e3da-69fd-47e9-a630-908404b23259.png"
curl -L -o img/safe-space-1x1.png     "$B/hf_20260930_142159_87d53274-cd7f-492b-b5ab-a97072086a69.png"
curl -L -o img/shield-source.png      "$B/hf_20260930_141906_fefb0f90-904c-452a-b404-8c0e68798bc6.png"
curl -L -o img/shield-cutout.png      "$B/hf_20260930_142048_116b6308-8afb-4797-b225-0241fb19d9df.png"
curl -L -o model/shield.glb           "$B/hf_20260930_142032_09d329ca-abd9-4f7e-8760-3e656fb5667f.glb"

# Point index.html at the local copies (backup saved as index.cdn.html)
cp ../index.html ../index.cdn.html
sed -i.bak "s#$B/hf_20260930_141916_08df2f31-06c3-4b21-8cbf-06f6aacb62d0.mp4#assets/video/hero-loop.mp4#g" ../index.html
sed -i.bak "s#$B/hf_20260930_141916_a2502433-7e54-486a-815b-873c17455a00.mp4#assets/video/dots-shield.mp4#g" ../index.html
sed -i.bak "s#$B/hf_20260930_141904_c76a0077-7aaf-438a-8312-f5897e2995a0.png#assets/img/commuters-16x9.png#g" ../index.html
sed -i.bak "s#$B/hf_20260930_142146_719dc449-29f3-417d-9a9b-eeac91697c86.png#assets/img/commuters-1x1.png#g" ../index.html
sed -i.bak "s#$B/hf_20260930_141904_85591d06-85c8-4448-a039-d7ec8abc2799.png#assets/img/phone-16x9.png#g" ../index.html
sed -i.bak "s#$B/hf_20260930_142150_618f41f6-d692-45a2-a72a-d86505b391a0.png#assets/img/phone-1x1.png#g" ../index.html
sed -i.bak "s#$B/hf_20260930_141904_f092f28c-be2a-460f-b546-f67af13360e6.png#assets/img/solidarity-16x9.png#g" ../index.html
sed -i.bak "s#$B/hf_20260930_142155_04a880d9-078c-479c-b3f6-296394152929.png#assets/img/solidarity-1x1.png#g" ../index.html
sed -i.bak "s#$B/hf_20260930_141905_5930e3da-69fd-47e9-a630-908404b23259.png#assets/img/safe-space-16x9.png#g" ../index.html
sed -i.bak "s#$B/hf_20260930_142159_87d53274-cd7f-492b-b5ab-a97072086a69.png#assets/img/safe-space-1x1.png#g" ../index.html
sed -i.bak "s#$B/hf_20260930_141906_fefb0f90-904c-452a-b404-8c0e68798bc6.png#assets/img/shield-source.png#g" ../index.html
sed -i.bak "s#$B/hf_20260930_142048_116b6308-8afb-4797-b225-0241fb19d9df.png#assets/img/shield-cutout.png#g" ../index.html
sed -i.bak "s#$B/hf_20260930_142032_09d329ca-abd9-4f7e-8760-3e656fb5667f.glb#assets/model/shield.glb#g" ../index.html
rm -f ../index.html.bak
echo "index.html now uses local assets in assets/."
echo "Done. Sizes:"; du -h video/* img/* model/*
