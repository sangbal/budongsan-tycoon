import os
from PIL import Image

# Directories
BASE_DIR = r"c:\Users\HOME\Documents\Python\clicksurvivor\kimchi-invasion"
SOURCE_DIR = os.path.join(BASE_DIR, "generated-images", "originals")
DEST_DIR = os.path.join(BASE_DIR, "generated-images")

# Target Sizes (Width, Height)
SIZE_MAPPING = {
    # Buildings
    "building_miner_b01": (64, 64),
    "building_ice_drill_b02": (64, 64),
    "building_greenhouse_b03": (64, 64),
    "building_hydroponics_b04": (128, 128),
    "building_mega_greenhouse_b05": (192, 192),
    "building_thawer_b06": (64, 64),
    "building_distiller_b07": (64, 64),
    "building_furnace_b08": (128, 128),
    "building_dryer_b09": (64, 64),
    "building_crusher_b10": (64, 64),
    "building_extractor_b11": (64, 64),
    "building_mixer_b12": (64, 64),
    "building_pickling_station_b13": (128, 128),
    "building_fermenter_b14": (64, 64),
    "building_packaging_machine_b17": (64, 64),
    "building_belt_b22": (64, 64),
    "building_inserter_b26": (64, 64),
    "building_warehouse_b33": (128, 128),
    "building_thermal_plant_b36": (128, 128),
    "building_power_pole_b41": (64, 64),
    
    # UI
    "ui_button_primary": (120, 40),
    "ui_panel_base": (48, 48),
    "ui_slot_frame": (48, 48),
}

def resize_assets():
    if not os.path.exists(SOURCE_DIR):
        print(f"Source directory not found: {SOURCE_DIR}")
        return

    processed_count = 0
    
    for filename in os.listdir(SOURCE_DIR):
        if not filename.endswith(".png"):
            continue
            
        name_no_ext = os.path.splitext(filename)[0]
        target_size = None
        
        # Check explicit mapping
        if name_no_ext in SIZE_MAPPING:
            target_size = SIZE_MAPPING[name_no_ext]
        # Check resource pattern
        elif name_no_ext.startswith("resource_"):
            target_size = (32, 32)
            
        if target_size:
            try:
                src_path = os.path.join(SOURCE_DIR, filename)
                dst_path = os.path.join(DEST_DIR, filename)
                
                with Image.open(src_path) as img:
                    # Use LANCZOS for high quality downsampling
                    resized_img = img.resize(target_size, Image.Resampling.LANCZOS)
                    # Create directory if somehow missing
                    if not os.path.exists(DEST_DIR):
                        os.makedirs(DEST_DIR)
                    resized_img.save(dst_path, optimize=True)
                    print(f"[OK] Resized {filename} to {target_size}")
                    processed_count += 1
            except Exception as e:
                print(f"[ERROR] Failed to process {filename}: {e}")
        else:
            print(f"[SKIP] No mapping for {filename}")

    print(f"Processing complete. {processed_count} files resized.")

if __name__ == "__main__":
    resize_assets()
