DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
aria2c --enable-rpc=true --rpc-listen-port=6800 --rpc-secret=secret --dht-file-path=${DIR}/dht.dat