#!/bin/bash

echo "🚀 Setting up FlashTL;DR Extension..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the extension
echo "🔨 Building extension..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode' (toggle in top right)"
echo "3. Click 'Load unpacked' and select the 'dist' folder"
echo "4. Get your OpenAI API key from https://platform.openai.com/api-keys"
echo "5. Click the extension icon and go to Settings to add your API key"
echo ""
echo "🎉 Ready to summarize content!"
