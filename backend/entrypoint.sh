#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset

/wait-for-it.sh postgres:5432 -t 5

exec "$@"
