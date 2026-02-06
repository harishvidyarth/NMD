#!/bin/bash

echo "Updating HTML files with new structure..."

for file in *.html; do
    if [ "$file" != "403.html" ] && [ "$file" != "404.html" ] && [ "$file" != "500.html" ]; then
        echo "Processing: $file"
        
        # Get the page-specific content (between header and footer)
        if [ "$file" == "index.html" ]; then
            content='<section class="hero">
                <h1>Welcome to NMD Associates</h1>
                <p>Your trusted partner for Insurance and Banking Services</p>
                <a href="quote-calculator.html" class="btn">Get a Quote</a>
            </section>
            <section class="features">
                <div class="feature-card">
                    <h3>Insurance Services</h2>
                    <p>Comprehensive insurance solutions for life, health, and property.</p>
                </div>
                <div class="feature-card">
                    <h3>Banking Solutions</h2>
                    <p>Personal and business banking with competitive rates.</p>
                </div>
                <div class="feature-card">
                    <h3>Investment Advisory</h2>
                    <p>Expert guidance for wealth creation and management.</p>
                </div>
            </section>'
        elif [ "$file" == "about-us.html" ]; then
            content='<section>
                <h1>About NMD Associates</h1>
                <p>With over 15 years of experience in financial services...</p>
            </section>'
        else
            # Extract main content from existing file
            content=$(sed -n '/<main>/,/<\/main>/p' "$file" | sed '1d;$d')
        fi
        
        # Create new file with includes
        {
            cat includes/header.html | sed "/<main>/q"
            echo "$content"
            cat includes/footer.html | sed -n '/<\/main>/,//p'
        } > "$file.new"
        
        mv "$file.new" "$file"
    fi
done

echo "✅ HTML files updated"
