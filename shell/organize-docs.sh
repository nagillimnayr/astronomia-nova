#!/usr/bin/bash
set -e
# Path to raw docs directory.
INPUT_DIR="./docs/"
# Path to organized docs directory.
OUTPUT_DIR="./src/pages/docs/"

# Clear the output directory.
rm -rf "$OUTPUT_DIR"


# Internal Field Separator.
IFS='/'
# Find sub-directories and iterate through them.
find "$INPUT_DIR" -maxdepth 1 -mindepth 1 -type d | while read -r dir;
do
  echo "$dir"
  # Iterate through files in sub-directory.
  for file in "$dir"/*
  do test -f "$file" && {
    # Use grep to search the file for the line containing '# Module: ' and then pipe that line to sed to substitute
    # the pattern with a null string, then assign the resulting string to the variable 'path'.
    path=$(grep -F "# Module:" "$file" | sed 's/# Module: //')
    echo "$path"

    # Split the string on '/' and assign elements to array arr.
    read -ra arr <<< "$path"
    echo "${arr[@]}"
    # Get the size of the array.
    size="${#arr[@]}"

    # Last item will be the actual file name.
    lastItem="${arr[$size-1]}"
    # echo "$lastItem"
    # Remove last item from the array.
    unset "arr[$size-1]"
    # Get the new size of the array.
    size="${#arr[@]}"

    dirPath="${OUTPUT_DIR}"
    for item in "${arr[@]}"
    do
      dirPath="${dirPath}${item}/"
    done
    filePath="${OUTPUT_DIR}${path}.md"

    # Create directory, -p creates parent directories as needed.
    mkdir -p "${dirPath}"

    # Copy file to new directory, -f (force) to overwrite contents of destination.
    cp -f "$file" "$filePath" && echo "filePath: ${filePath}"


    echo
    }
  done
done
