# GitHub Pages Setup Guide

## Prerequisites

Your GitHub Actions deployment is failing due to permission issues. Follow these steps to fix it:

## Step 1: Enable GitHub Pages with GitHub Actions

1. Go to your repository on GitHub: `https://github.com/amanabdullayev/amanabdullayev.github.io`
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions** (instead of "Deploy from a branch")
5. Click **Save**

## Step 2: Verify Repository Permissions

1. In the same **Settings** tab, go to **Actions** → **General**
2. Under **Workflow permissions**, ensure:
   - ✅ **Read and write permissions** is selected
   - ✅ **Allow GitHub Actions to create and approve pull requests** is checked
3. Click **Save**

## Step 3: Re-run the Failed Action

1. Go to **Actions** tab in your repository
2. Find the failed workflow run
3. Click **Re-run all jobs**

## Alternative: Manual Token Setup (if above doesn't work)

If the above steps don't work, you may need to create a personal access token:

1. Go to GitHub **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens**
2. Create a new token with:
   - Repository access: Your repository
   - Permissions: `Contents: Write`, `Pages: Write`, `Metadata: Read`
3. Add the token as a secret named `GITHUB_TOKEN` in your repository secrets

## Expected Result

After following these steps, your GitHub Actions workflow should:
- ✅ Successfully generate blog posts
- ✅ Deploy to GitHub Pages
- ✅ Make your site available at: `https://amanabdullayev.github.io`

## Troubleshooting

If you still get permission errors:
1. Check that GitHub Pages is enabled and source is set to "GitHub Actions"
2. Verify workflow permissions are set to "Read and write"
3. Ensure your repository is public (required for free GitHub Pages)
4. Try re-running the workflow after a few minutes

## Current Workflow Features

Your updated workflow now:
- ✅ Uses the latest GitHub Actions versions
- ✅ Has proper permissions configuration
- ✅ Uses the official GitHub Pages deployment action
- ✅ Generates blog posts from markdown files
- ✅ Handles environment configuration
- ✅ Runs on every push to main branch
- ✅ Has a daily rebuild schedule
