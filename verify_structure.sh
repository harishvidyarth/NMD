#!/bin/bash

echo "🔍 Verifying website structure..."
echo ""

# Check essential files
essential_files=(".htaccess" "index.html" "robots.txt" "sitemap.xml" "security.txt")
for file in "${essential_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (MISSING)"
    fi
done

echo ""
echo "📁 Directory Structure:"
find . -maxdepth 3 -type f -name "*.html" -o -name "*.css" -o -name "*.js" | sort

echo ""
echo "🔒 Security Headers Check:"
if [ -f ".htaccess" ]; then
    grep -c "Header set" .htaccess | xargs echo "Security headers found:"
else
    echo "No .htaccess file found"
fi

echo ""
echo "🌐 Sitemap URLs:"
if [ -f "sitemap.xml" ]; then
    grep -c "<loc>" sitemap.xml | xargs echo "URLs in sitemap:"
fi

echo ""
echo "📊 Statistics:"
echo "HTML files: $(find . -name "*.html" | wc -l)"
echo "CSS files: $(find . -name "*.css" | wc -l)"
echo "JS files: $(find . -name "*.js" | wc -l)"
