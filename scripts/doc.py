import subprocess

#Path to documentation directory.
docDir = './src/pages/info/docs/'

modules = {
  'body': {
    'entryPoint': './src/components/canvas/body', 
  },
  'orbit': './src/components/canvas/orbit',
}

def main():
  for name, module in modules.items():
    entry_point = module["entryPoint"]
    outDir = docDir + name
    subprocess.call(f'npx typedoc --entryPoints "{entry_point}" --out "{outDir}"', shell=True)

    # Typedoc outputs a README file to the output directory. Delete it.
    subprocess.call(f'rm {outDir}/README.md')

    subprocess.call(f'touch {outDir}/_meta.json')

if __name__ == '__main__':
  main()
