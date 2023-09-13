import subprocess
import json

# Path to documentation directory.
docDir = "./src/pages/info/docs/"

modules = {
    "body": {
        "entryPoint": "./src/components/canvas/body/",
    },
    "orbit": {
        "entryPoint": "./src/components/canvas/orbit/",
    },
}


def main():
    entry_points = ""
    for entry_point in modules.values():
        entry_points += f'--entryPoints {entry_point["entryPoint"]} '
    command = f'npx typedoc {entry_points} --out "{docDir}"'
    print(command)
    subprocess.call(command, shell=True)

    subprocess.call(f"touch {docDir}/_meta.json", shell=True)

    meta = {"modules": "Sub-modules", "classes": "Classes"}

    # Write json data to _meta.json.
    meta_file = open(f"{docDir}/_meta.json", "w")
    json.dump(meta, meta_file)
    meta_file.close()


if __name__ == "__main__":
    main()
