# LIGTAS asset table

All assets were generated with Higgsfield AI on 30 September 2026 in one style: soft violet, teal and warm coral gradients, cinematic lighting, modern Filipino urban setting.

Base URL: `https://d8j0ntlcm91z4.cloudfront.net/user_3K0CFOcn2VlzDLUUHyafEalBaqJ/`

| # | Asset | Tool / model | File | Local path (after download script) | Used in |
|---|---|---|---|---|---|
| 1 | Hero loop, 8 s, 16:9, silent | generate_video / Kling 3.0 | `hf_20260930_141916_08df2f31-06c3-4b21-8cbf-06f6aacb62d0.mp4` | assets/video/hero-loop.mp4 | Hero background |
| 2 | Dots gathering into heart/shield, 5 s | generate_video / Kling 3.0 | `hf_20260930_141916_a2502433-7e54-486a-815b-873c17455a00.mp4` | assets/video/dots-shield.mp4 | Take Action, pledge card |
| 3 | Commuters on MRT, 16:9 | generate_image / GPT Image 2.5 | `hf_20260930_141904_c76a0077-7aaf-438a-8312-f5897e2995a0.png` | assets/img/commuters-16x9.png | Understanding the Issue |
| 4 | Commuters, 1:1 | + upscale_image (2K) | `hf_20260930_142146_719dc449-29f3-417d-9a9b-eeac91697c86.png` | assets/img/commuters-1x1.png | Same, on phones |
| 5 | Student with phone shield, 16:9 | generate_image | `hf_20260930_141904_85591d06-85c8-4448-a039-d7ec8abc2799.png` | assets/img/phone-16x9.png | Spare (online-safety visual) |
| 6 | Student with phone shield, 1:1 | + upscale_image (2K) | `hf_20260930_142150_618f41f6-d692-45a2-a72a-d86505b391a0.png` | assets/img/phone-1x1.png | Spare |
| 7 | Solidarity group, 16:9 | generate_image | `hf_20260930_141904_f092f28c-be2a-460f-b546-f67af13360e6.png` | assets/img/solidarity-16x9.png | Inclusion section; hero video poster |
| 8 | Solidarity group, 1:1 | + upscale_image (2K) | `hf_20260930_142155_04a880d9-078c-479c-b3f6-296394152929.png` | assets/img/solidarity-1x1.png | Inclusion, on phones |
| 9 | Abstract safe space, 16:9 | generate_image | `hf_20260930_141905_5930e3da-69fd-47e9-a630-908404b23259.png` | assets/img/safe-space-16x9.png | The Law Protects You |
| 10 | Abstract safe space, 1:1 | + upscale_image (2K) | `hf_20260930_142159_87d53274-cd7f-492b-b5ab-a97072086a69.png` | assets/img/safe-space-1x1.png | Laws, on phones |
| 11 | Low-poly shield with open palm | generate_image | `hf_20260930_141906_fefb0f90-904c-452a-b404-8c0e68798bc6.png` | assets/img/shield-source.png | Source for the 3D model |
| 12 | Shield cut-out | remove_background | `hf_20260930_142048_116b6308-8afb-4797-b225-0241fb19d9df.png` | assets/img/shield-cutout.png | Static 3D fallback (reduced motion, or if the GLB fails) |
| 13 | 3D shield, GLB | generate_3d / image_to_3d | `hf_20260930_142032_09d329ca-abd9-4f7e-8760-3e656fb5667f.glb` | assets/model/shield.glb | Interactive 3D section |

Notes:
- The 1:1 images were upscaled to 2K. The 16:9 images are used at their original 1K size, which is enough for their on-screen width and keeps pages light.
- The student-with-phone images (#5, #6) were generated for the online-safety theme but aren't placed on the page. You can swap them in for the commuters image in *Understanding the Issue* if you prefer.
