import os
from PIL import Image

# Directories
BASE_DIR = r"c:\Users\HOME\Documents\Python\clicksurvivor\kimchi-invasion"
TARGET_DIR = os.path.join(BASE_DIR, "generated-images")

# Expected Sizes
EXPECTED_SIZES = {
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

def audit_assets():
    if not os.path.exists(TARGET_DIR):
        print(f"Target directory not found: {TARGET_DIR}")
        return

    print(f"Auditing assets in: {TARGET_DIR}")
    print("-" * 60)
    print(f"{'Filename':<35} | {'Size':<10} | {'Status':<10}")
    print("-" * 60)

    issues_found = 0
    
    for filename in sorted(os.listdir(TARGET_DIR)):
        if not filename.endswith(".png"):
            continue
            
        name_no_ext = os.path.splitext(filename)[0]
        full_path = os.path.join(TARGET_DIR, filename)
        
        try:
            with Image.open(full_path) as img:
                actual_size = img.size
                
                expected = None
                if name_no_ext in EXPECTED_SIZES:
                    expected = EXPECTED_SIZES[name_no_ext]
                elif name_no_ext.startswith("resource_"):
                    expected = (32, 32)
                
                status = "UNKNOWN"
                if expected:
                    if actual_size == expected:
                        status = "PASS"
                    else:
                        status = f"FAIL (Exp: {expected})"
                        issues_found += 1
                else:
                    status = "NO SPEC"
                    
                print(f"{filename:<35} | {str(actual_size):<10} | {status}")
        except Exception as e:
            print(f"{filename:<35} | ERROR      | {e}")
            issues_found += 1

    print("-" * 60)
    if issues_found == 0:
        print("✅ ALL ASSETS PASSED AUDIT")
    else:
        print(f"❌ FOUND {issues_found} ISSUES")

if __name__ == "__main__":
    audit_assets()
