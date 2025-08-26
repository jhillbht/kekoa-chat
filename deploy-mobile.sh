#!/bin/bash

echo '🚀 Deploying Kekoa Chat Mobile v3.1 to Vercel...'
echo '=================================================='
echo ''

# Check if we're in the right directory
pwd
echo ''

# Try to run Vercel deployment
if command -v npx &> /dev/null; then
    echo '✅ npx found, deploying...'
    npx vercel --prod --yes
elif command -v vercel &> /dev/null; then
    echo '✅ vercel found, deploying...'
    vercel --prod --yes
else
    echo '❌ Vercel CLI not found. Please install it first:'
    echo 'npm install -g vercel'
    echo ''
    echo 'Or run manually in Terminal:'
    echo 'npx vercel --prod --yes'
fi

echo ''
echo '🎉 Deployment script complete!'
