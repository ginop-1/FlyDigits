#!/bin/bash

zapworks_bin=""
base_dir="./models"

# Check if zapworks cli tool is installed
if ! command -v zapworks &> /dev/null
then
    echo "zapworks-cli could not be found"
    echo "Please install zapworks-cli and try again"
    exit
fi

# create empty "placeholder.zpt" file if it doesn't exist
if [ ! -f "$base_dir/placeholder.zpt" ]; then
    echo "Creating placeholder.zpt... " -n
    touch $base_dir/placeholder.zpt
    echo "Done"
fi

# every png file in $base_dir/images should be converted to zpt and placed in $base_dir
for file in $base_dir/images/*.png
do
    filename=$(basename -- "$file")
    filename="${filename%.*}"
    # check if zpt file already exists
    if [ -f "$base_dir/$filename.zpt" ]; then
        echo "$filename.zpt already exists, skipping"
        continue
    fi
    echo -n "Converting $filename.png to $filename.zpt... "
    zapworks train $base_dir/images/$filename.png -o $base_dir/$filename.zpt &> /dev/null
    echo "Done"
done