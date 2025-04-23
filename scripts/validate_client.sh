CLIENT_DIR=$1
SERVER_DIR=$2
if [[ ! $CLIENT_DIR || ! $SERVER_DIR ]]; then
    cat <<EOF

    Usage
        validate_client.sh client_directory server_directory

EOF
    exit 1
fi

ERROR=0

validate_fetch_file () {
    FILE="$1"
    DIR="$(dirname $FILE)/"
    for line in $(grep 'api/' $FILE | grep -o 'api/.*\.php'); do
        endpoint="${line##api}";
        if [[ ! -f "$SERVER_DIR$endpoint" ]]; then
            echo "endpoint \"$line\" in file \"$FILE\" not found"
            ERROR=1
        fi
    done
}

for file in $(find $CLIENT_DIR \( -name "*.tsx" -or -name "*.ts" \) | grep -v 'node_modules'); do
    validate_fetch_file $file
done

exit $ERROR
