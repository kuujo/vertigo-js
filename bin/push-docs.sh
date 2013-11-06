#!/bin/sh
rm -rf docs
git clone git@github.com:kuujo/vertigo-docs.git docs -b gh-pages
jsdoc src/main/resources -r --directory=docs/js
cd docs
git add -A
git commit -m "Updated documentation."
git push origin gh-pages
