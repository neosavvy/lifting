# Changelog

## 2025-02-08 09:55:17 EST
### Changed
- Renamed application from "Matrix Lifts" to "Lift!"
  - Updated app title in Layout component navigation
  - Updated authentication page title
  - Modified browser page title in index.html

## 2025-02-08 09:59:25 EST
### Fixed
- Improved text visibility in dark mode for profile dropdown
  - Changed dropdown background to black in dark mode
  - Updated text colors to use Matrix theme green (#00ff00)
  - Adjusted hover states for better contrast

## 2025-02-08 10:02:24 EST
### Fixed
- Enhanced authentication UI visibility in dark mode
  - Updated Supabase Auth UI theme colors
  - Added explicit color variables for messages, links, and labels
  - Set consistent Matrix green (#00ff00) color for all text elements
  - Improved hover states and contrast for interactive elements

## 2025-02-08 10:03:24 EST
### Fixed
- Updated authentication page header color
  - Changed "Lift! Authentication" text to match Matrix theme green (#00ff00)
  - Ensured consistent color scheme across the authentication interface

## 2025-02-08 10:07:39 EST
### Added
- Workout completion tracking feature
  - Added "Nailed it!" and "Failed it!" buttons to each major lift
  - Implemented persistent storage using localStorage
  - Added visual feedback for completed/failed lifts
  - Created new workout types for TypeScript support

## 2025-02-08 10:11:54 EST
### Added
- Workout sharing feature
  - Added "Flex on 'em! 💪" button to share workout results
  - Implemented clipboard copy functionality for sharing
  - Created Wordle-style emoji summary of lift completions
  - Added motivational message with hashtags for social sharing

## 2025-02-08 10:42:35 EST
### Enhanced
- Improved workout sharing format
  - Added colored square emojis to represent plate weights (🟩=25lbs, 🟨=35lbs, 🟦=45lbs)
  - Streamlined message layout with cleaner spacing
  - Added website URL to shared messages
  - Simplified lift names to SQAT, BNCH, OHPR, DLFT
