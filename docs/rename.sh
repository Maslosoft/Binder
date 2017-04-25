#!/bin/bash
for file in *.php; do
    base="${file%.*}"
    mkdir $base
    mv $file "$base/index.php"
    echo "$base"
    echo `basename $file`
done