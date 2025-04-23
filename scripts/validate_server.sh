SERVER_DIR=$1
if [ ! $SERVER_DIR ]; then
    cat <<EOF

    Usage
        validate_server.sh server_directory

EOF
    exit 1
fi

ERROR=0

validate_includes_file () {
    FILE="$1"
    DIR="$(dirname $FILE)/"
    for line in $(grep 'include\s*".*"' $FILE | grep -o '".*"' | grep -o '[^"]*'); do
        if [[ ! -f "$DIR$line" ]]; then
            echo "include \"$line\" in file \"$FILE\" not found"
            ERROR=1
        fi
    done
}

for file in $(find $SERVER_DIR -name "*.php"); do
    validate_includes_file $file
done

exit $ERROR
