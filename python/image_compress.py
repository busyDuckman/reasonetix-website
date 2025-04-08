import os
import shutil
import requests
from PIL import Image
from dotenv import load_dotenv

# Load API key
load_dotenv()
TINIFY_API_KEY = os.getenv("TINIFY_API_KEY")

# Category widths
CATEGORY_WIDTHS = {
    'gallery': 400,
    'projects': 600,
    'project_examples': 600,
    'stock': 1024,
}

VALID_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}

BASE_DIR = './images'

def is_image(filename):
    return os.path.splitext(filename.lower())[1] in VALID_EXTENSIONS

def prepare_source_folders():
    for root, dirs, files in os.walk(BASE_DIR):
        if os.path.basename(root) == '_src':
            continue
        src_path = os.path.join(root, '_src')
        os.makedirs(src_path, exist_ok=True)

        for file in files:
            if is_image(file):
                src_file = os.path.join(root, file)
                dst_file = os.path.join(src_path, file)
                if not os.path.exists(dst_file):
                    shutil.copy2(src_file, dst_file)
                    print(f"Copied original: {src_file} -> {dst_file}")
    return True

def tinify_compress(infile, outfile):
    try:
        with open(infile, 'rb') as f:
            response = requests.post(
                'https://api.tinify.com/shrink',
                auth=("api", TINIFY_API_KEY),
                data=f
            )
            if response.status_code == 201:
                result_url = response.json()['output']['url']
                result = requests.get(result_url)
                with open(outfile, 'wb') as out:
                    out.write(result.content)
                print(f"Compressed via TinyPNG: {outfile}")
            else:
                print(f"TinyPNG error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"TinyPNG compression failed for {infile}: {e}")

def compress_image(infile, outfile, width):
    try:
        with Image.open(infile) as img:
            img_format = img.format
            w_percent = width / float(img.size[0])
            h_size = int((float(img.size[1]) * float(w_percent)))
            img = img.resize((width, h_size), Image.LANCZOS)

            # Convert mode for formats like JPEG
            if img_format == 'JPEG' and img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')

            temp_out = os.path.splitext(outfile)[0] + ".temp" + os.path.splitext(outfile)[1]
            img.save(temp_out, optimize=True, quality=70)
            print(f"Resized: {infile} -> {temp_out}")
            tinify_compress(temp_out, outfile)
            os.remove(temp_out)
    except Exception as e:
        print(f"Failed to compress {infile}: {e}")

def make_small(base_path, desired_width):
    for root, dirs, files in os.walk(base_path):
        if os.path.basename(root) == '_src':
            continue

        src_path = os.path.join(root, '_src')
        if not os.path.exists(src_path):
            continue

        # Delete improperly sized files
        for file in files:
            if is_image(file):
                filepath = os.path.join(root, file)
                try:
                    img = Image.open(filepath)
                    width_ok = img.size[0] == desired_width
                    img.close()
                    if not width_ok:
                        os.remove(filepath)
                        print(f"Deleted wrong size: {filepath}")
                except Exception as e:
                    print(f"Error checking {filepath}: {e}")

        # Create resized versions of _src images
        for file in os.listdir(src_path):
            if not is_image(file):
                continue

            src_file = os.path.join(src_path, file)
            dst_file = os.path.join(root, file)

            if not os.path.exists(dst_file):
                print(f"Generating: {dst_file}")
                compress_image(src_file, dst_file, desired_width)

def main():
    if prepare_source_folders():
        for folder, width in CATEGORY_WIDTHS.items():
            print(f"\nProcessing category: {folder} (width={width})")
            make_small(os.path.join(BASE_DIR, folder), width)
    else:
        print("Error: unable to setup source folders. Stopping now.")

if __name__ == '__main__':
    main()
