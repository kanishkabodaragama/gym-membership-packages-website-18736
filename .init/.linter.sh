#!/bin/bash
cd /home/kavia/workspace/code-generation/gym-membership-packages-website-18736/gym_packages_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

