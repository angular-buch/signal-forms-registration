#!/bin/bash

# Create local tmp directory
mkdir -p tmp/{version-1,version-2,version-3}

# Copy files with normalized names
cp -r src/app/registration-form-1/* tmp/version-1/
cp -r src/app/registration-form-2/* tmp/version-2/
cp -r src/app/registration-form-3/* tmp/version-3/

# Rename files
cd tmp/version-1 && for f in registration-form-1.*; do mv "$f" "${f/registration-form-1/registration-form}"; done
cd ../version-2 && for f in registration-form-2.*; do mv "$f" "${f/registration-form-2/registration-form}"; done
cd ../version-3 && for f in registration-form-3.*; do mv "$f" "${f/registration-form-3/registration-form}"; done
cd ../..

# Remove spec files
rm -f tmp/*/registration-form.spec.ts

# Clean up HTML files - remove everything before <form
sed -i '' '1,/<form/{ /<form/!d; }' tmp/*/registration-form.html

# Remove BackButton import and reference from TypeScript files
sed -i '' "\|import { BackButton } from '../back-button/back-button';|d" tmp/*/registration-form.ts
sed -i '' 's/BackButton, //g' tmp/*/registration-form.ts

# Update class names and selectors
sed -i '' 's/RegistrationForm1/RegistrationForm/g; s/registration-form-1/registration-form/g' tmp/version-1/registration-form.ts
sed -i '' 's/RegistrationForm2/RegistrationForm/g; s/registration-form-2/registration-form/g' tmp/version-2/registration-form.ts
sed -i '' 's/RegistrationForm3/RegistrationForm/g; s/registration-form-3/registration-form/g' tmp/version-3/registration-form.ts

# Generate diffs
git diff --no-index tmp/version-1 tmp/version-2 > version-1-version-2.diff
git diff --no-index tmp/version-2 tmp/version-3 > version-2-version-3.diff

# Remove tmp paths from diffs
sed -i '' 's|tmp/version[123]/||g' version-1-version-2.diff version-2-version-3.diff

# Generate HTML views
npx diff2html-cli -i file -o stdout -s side --title="Version 1 - Version 2" -- version-1-version-2.diff > public/version-1-version-2.html
npx diff2html-cli -i file -o stdout -s side --title="Version 2 - Version 3" -- version-2-version-3.diff > public/version-2-version-3.html

# Move diff files to public
mv version-1-version-2.diff public/
mv version-2-version-3.diff public/

# Cleanup
rm -rf tmp

echo "Generated: public/version-1-version-2.html and public/version-2-version-3.html"
