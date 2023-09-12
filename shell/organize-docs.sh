#!/usr/bin/bash
set -e
# Path to raw docs directory.
INPUT_DIR="./docs/"
# Path to organized docs directory.
OUTPUT_DIR="./src/pages/docs/"


echo -e "Today's date: " "$(date)" "\n"

ls $INPUT_DIR
echo



# Adding '/' to the end will match only directories.
for dir in "$INPUT_DIR"/*/
do
  test -f "$dir" && echo "$(basename "$dir")" "Is a file!"
  test -d "$dir" && echo "$(basename "$dir")" "Is a directory!" && echo "$dir"
done

# Internal Field Separator.
IFS='/'
find "$INPUT_DIR" -maxdepth 1 -mindepth 1 -type d | while read -r dir;
do
  echo "$dir"
  for file in "$dir"/*
  do test -f "$file" && {
#    filename=$(basename "$file")
#    echo "$filename"
#    # Split the string on '_' characters.
#    read -ra arr <<< "$filename"
#    size="${#arr[@]}"
#    echo "Size of array: " "$size"
#    # Last item will be the actual file name.
#    lastItem="${arr[$size-1]}"
#    echo "Last item: " "$lastItem"
#
#    unset "arr[$size-1]"
#    echo "${arr[@]}"
#    size="${#arr[@]}"
#    echo  "Size of array: " "$size"
#    firstItem="${arr[0]}"
#    echo "first item: " "$firstItem"
#    unset "arr[0]"
#    echo "${arr[@]}"
#
#    echo
#    grep -F "# Module:" "$file" > temp.txt
#    temp=./temp.txt
#
#    cat "$temp"
#    str=$(grep -v "# Module:" "$temp")

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
    echo "$lastItem"
    # Remove last item from the array.
    unset "arr[$size-1]"
    # Get the new size of the array.
    size="${#arr[@]}"

    dirPath="${OUTPUT_DIR}"
    for item in "${arr[@]}"
    do
      dirPath="${dirPath}${item}/"
    done
    filePath="${OUTPUT_DIR}${path}.mdx"
    echo "dirPath: ${dirPath}"

    # Create directory, -p creates parent directories as needed.
    mkdir -p "${dirPath}" && echo "successfully created ${dirPath}"

    echo "filePath: ${filePath}"
    # Copy file to new directory, -f (force) to overwrite contents of destination.
    cp -f "$file" "$filePath"


    echo
    }
  done
done

