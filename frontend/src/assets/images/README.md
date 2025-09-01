# Source Assets Directory

This directory contains images that are imported and processed by the build system.

## Structure

- **components/** - Images used by specific React components
- **pages/** - Images used by specific page components

## Usage

Images in this directory should be imported in React components:

```tsx
import heroImage from '../assets/images/pages/hero-banner.jpg';

function HomePage() {
  return <img src={heroImage} alt="Hero Banner" />;
}
```

## Benefits

- Images are processed and optimized by Vite
- Automatic cache busting with hashed filenames
- Better tree shaking (unused images won't be included)
- TypeScript support for image imports