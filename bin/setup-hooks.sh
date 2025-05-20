#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "$0")

if [ ! -d ".git/hooks" ]; then
    echo "No .git/hooks directory found"
    exit 1
fi

for hook in "$SCRIPT_DIR/hooks"/*; do
    if [ ! -f "$hook" ]; then
        continue
    fi

    hook_name=$(basename "$hook")
    cp "$hook" ".git/hooks/$hook_name"
    chmod +x ".git/hooks/$hook_name"
    echo "Installed $hook_name hook"
done
