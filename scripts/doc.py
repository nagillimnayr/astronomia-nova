import subprocess
import json

#Path to documentation directory.
docDir = './src/pages/info/docs/'

modules = {
  'body': {
    'entryPoint': './src/components/canvas/body', 
  },
  'orbit': {
    'entryPoint': './src/components/canvas/orbit',
  },
}

def main():
  for name, module in modules.items():
    entry_point = module["entryPoint"]
    outDir = docDir + name
    subprocess.call(f'npx typedoc --entryPoints "{entry_point}" --out "{outDir}"', shell=True)

    # Typedoc outputs a README file to the output directory. Delete it.
    subprocess.call(f'rm {outDir}/README.md', shell=True)

    subprocess.call(f'touch {outDir}/_meta.json', shell=True)

    meta = {
      "modules": "Sub-modules",
      "classes": "Classes"
    }

    # Write json data to _meta.json.
    meta_file = open(f'{outDir}/_meta.json', 'w')
    json.dump(meta, meta_file)
    meta_file.close()



if __name__ == '__main__':
  main()
