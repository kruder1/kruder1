# KRUDER 1 - Software User Manual

**Version 1.0.0**

---

## Table of Contents

1. [Overview](#1-overview)
2. [Installation](#2-installation)
3. [Getting Started](#3-getting-started)
4. [Dashboard](#4-dashboard)
5. [Event Manager](#5-event-manager)
6. [Event Mode](#6-event-mode)
7. [Prompt Lab](#7-prompt-lab)
8. [Frames](#8-frames)
9. [Settings](#9-settings)
10. [Credit System](#10-credit-system)
11. [Statistics](#11-statistics)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Overview

KRUDER 1 is an AI-powered photo booth desktop application designed for event operators, photographers, and entertainment professionals. The software allows users to capture photos at events, apply AI-powered style transformations using customizable prompts, and deliver the results to guests via QR code, email, or print.

### How It Works

- Guests select an AI style (prompt), take a photo at the booth, and the software generates an AI-transformed image based on the selected style.
- Each AI generation costs **1 credit**. Credits are purchased through the application in packages.
- Generated images are uploaded to the cloud and made available via a unique QR code and shareable web page. Guests can also receive their image by email.
- An optional PNG frame overlay can be composited onto every generated image for branding purposes.

### Target Users

- Event and party planners
- Wedding photographers
- Corporate event organizers
- Photo booth rental operators
- Marketing and brand activation teams

---

## 2. Installation

### System Requirements

- **Operating System:** Windows 10 or later
- **Architecture:** x86_64 (64-bit)
- **Internet Connection:** Required for account login, AI generation, credit purchases, email delivery, and cloud synchronization
- **Camera:** USB or built-in webcam (required for photo capture in Event Mode)
- **Printer (optional):** Any Windows-compatible printer for on-site printing

### Python Dependencies

If running from source, the following packages are required:

| Package | Minimum Version |
|---------|----------------|
| pywebview | 4.0 |
| Pillow | 10.0 |
| requests | 2.28 |
| qrcode | 7.4 |
| pywin32 | (latest, for printing support) |

### Installation Steps

1. Download the KRUDER 1 installer (`.exe`) from the official website or through the in-app software update mechanism.
2. Run the installer and follow the on-screen instructions.
3. Launch KRUDER 1 from the desktop shortcut or Start menu.

### Local Data Storage

Application data is stored in:

```
%APPDATA%\Kruder1\
```

This directory contains session data, prompts database, frames, event data, and log files. Logs are rotated daily and retained for 30 days. Sensitive data is automatically redacted from logs.

---

## 3. Getting Started

### Registration and Account Setup

Account registration is handled through the KRUDER 1 website. You will need:

- A valid email address
- A password

After registering, you must **verify your email** by clicking the confirmation link sent to your inbox before you can log in.

### Claiming Demo Credits

New users can claim **10 demo credits** (once per hardware device) to try the software before purchasing a credit package. Demo credits are claimed through the website and are tied to your device's hardware identifier (HWID).

### First Login

1. Launch KRUDER 1. The application displays an animated boot screen with the KRUDER 1 logo.
2. After the boot animation, the **LOGIN** screen appears.
3. Enter your **EMAIL ADDRESS** and **PASSWORD** in the input fields.
4. Press the **LOG IN** button.
5. If authentication succeeds, you are taken directly to the **DASHBOARD**.
6. If the credentials are incorrect, an error message is displayed.

The login screen also provides a **QUIT** button to exit the application. Pressing QUIT shows a confirmation dialog ("EXIT SYSTEM?") with CANCEL and CONFIRM options.

**Keyboard shortcuts on the login screen:**

- **Enter** on the email field: moves focus to the password field.
- **Enter** on the password field: submits the login form.
- **Escape**: closes any open modal dialog.

### Session Persistence

Once logged in, your session is stored locally. On subsequent launches, the application checks for a valid session token and takes you directly to the Dashboard without requiring re-login.

---

## 4. Dashboard

The Dashboard is the central hub of the application. It displays a grid of navigation buttons providing access to all major features.

### Dashboard Buttons

| Button | Icon | Action |
|--------|------|--------|
| **ACCOUNT** | User circle | Opens the Account Information panel |
| **EVENT MANAGER** | Lightning bolt | Navigates to the Event Manager module |
| **PROMPT LAB** | Flask | Navigates to the Prompt Lab module |
| **FRAMES** | Image | Navigates to the Frames module |
| **STATISTICS** | Bar chart | Opens the Statistics view (within Settings) |
| **SETTINGS** | Gear | Navigates to the Settings module |
| **QUIT** | Power off | Shows the exit confirmation dialog |

### Account Information Panel

Pressing **ACCOUNT** opens a panel overlay showing:

- **SIGNED IN AS**: Your email address
- **CREDITS**: Your current credit balance
- **LOGOUT** button: Initiates the logout process
- **REFRESH** button: Syncs your account data (including credit balance) with the server

To close the Account panel, click anywhere outside the panel.

### Logout Process

Logging out requires password verification for security:

1. Press **LOGOUT** in the Account panel.
2. A modal appears with a **virtual keyboard** and password field titled "ENTER PASSWORD TO LOGOUT".
3. Type your account password using the virtual keyboard or physical keyboard.
4. Press **CONFIRM** to proceed with logout, or **CANCEL** to go back.
5. If the password is correct, your session is cleared and you are returned to the Login screen.
6. If the password is incorrect, the message "WRONG PASSWORD" is displayed.

### Lock Screen

The Dashboard includes a **lock button** (padlock icon) in the top-left corner. Pressing it activates the lock screen, which displays the message:

> "WE'LL BE BACK IN A FEW MINUTES..."

This message can be customized in Settings (see [Security PIN](#security-pin)).

**Unlocking the dashboard:**

- If no PIN is configured, pressing the unlock button (open padlock icon) immediately returns to the Dashboard.
- If a PIN is configured, an "ENTER PIN" keypad appears. Enter the correct 4-digit PIN to unlock. The PIN modal auto-closes after 5 seconds of inactivity.

### Navigation via Logo

The KRUDER 1 logo is displayed at the top of the application. Clicking the logo navigates back to the Dashboard from any module, except when in Event Mode (where logo clicks are disabled to prevent accidental exits).

---

## 5. Event Manager

The Event Manager allows you to create and manage events. Each event serves as a container for a photo generation session, storing all captured photos, statistics, and guest email addresses.

### Events List View

When you open the Event Manager, you see a grid of all existing events sorted by creation date (newest first). Each event is displayed as a card showing its name.

The **CREATE EVENT** button (with a calendar-plus icon) is always visible in the grid.

### Creating an Event

1. Press **CREATE EVENT**.
2. A modal dialog appears titled "CREATE NEW EVENT" with a virtual keyboard.
3. Type the event name using the virtual keyboard or physical keyboard.
4. Press **CONFIRM** to create the event, or **CANCEL** to dismiss.
5. The new event appears in the Events grid.

### Event Actions View

Tapping an event card opens the Event Actions view, which displays the event name (with an edit/rename icon) and two action buttons:

| Button | Icon | Action |
|--------|------|--------|
| **START** | Play | Launches Event Mode for this event |
| **GALLERY** | Images | Opens the event's photo gallery |

### Renaming an Event

1. In the Event Actions view, press the **pen icon** next to the event name.
2. A "RENAME EVENT" modal appears with a virtual keyboard, pre-filled with the current name.
3. Edit the name and press **CONFIRM**.

### Deleting an Event

Events can be deleted by dragging and dropping:

1. In the Events list, press and hold an event card.
2. Drag it toward the trash icon that appears at the bottom of the screen.
3. Drop the card onto the trash icon.
4. A confirmation dialog appears: "DELETE EVENT AND ALL FILES?"
5. Press **CONFIRM** to delete (the event folder is sent to the Windows Recycle Bin) or **CANCEL** to abort.

### Event Gallery

The Gallery view for an event provides two ways to browse generated images:

- **SEARCH**: Opens a virtual keyboard modal where you can type an email address or generation ID to find specific images.
- **SHOW ALL GALLERY**: Displays all images in a grid. If a PIN is configured, you must enter it before viewing the full gallery.

Each gallery image card shows:
- The AI-generated result image as a thumbnail
- The associated email address (if provided by the guest)

**Viewing an image:** Tap any image card to open a full-screen preview. The preview supports zoom (mouse wheel or pinch gesture, 1x to 2.5x) and pan (click-drag or touch-drag when zoomed in).

**Deleting a gallery image:** Drag an image card to the trash icon. A confirmation dialog ("DELETE THIS IMAGE?") appears. Deleted images are sent to the Windows Recycle Bin.

### Exporting Gallery

From the Gallery view, you can export the event's images:

1. Press the **EXPORT** button (available in the gallery view).
2. Choose the export format:
   - **IMAGES**: Copies individual image files to a selected folder.
   - **ZIP**: Creates a compressed ZIP archive of all images.
3. A file dialog appears to choose the destination.

### Import / Export Events (.kruder1)

The Event Manager supports importing and exporting event data as `.kruder1` files (ZIP archives containing `data.json` and an `images/` directory).

---

## 6. Event Mode

Event Mode is the live photo booth experience. It guides guests through the process of selecting an AI style, taking a photo, and receiving the AI-generated result.

### Starting Event Mode

1. From the Event Actions view, press **START**.
2. The application enters Event Mode with the "TOUCH TO START..." screen.

The Event Mode start screen has two buttons in the top-left corner:

| Button | Action |
|--------|--------|
| **EXIT** | Returns to the Dashboard (requires PIN if configured) |
| **GALLERY** | Opens the event's gallery (navigates to Event Manager gallery view) |

### Full Event Mode Flow

The guest experience follows this sequence:

#### Step 1: Touch to Start

The screen displays "TOUCH TO START..." with a breathing animation. Tapping anywhere on the screen (except the EXIT and GALLERY buttons) begins the flow.

#### Step 2: Select Category

A grid of available prompt categories is displayed (title: "SELECT CATEGORY"). Each category card shows up to 4 thumbnail images from its prompts and the category name. Only categories that are **enabled** in the Prompt Lab are shown.

Press the back arrow to return to the start screen.

#### Step 3: Select Style

After choosing a category, the available prompt styles within that category are shown (title: the category name). Each style card shows the prompt's thumbnail image and name. Only prompts that are **enabled** are displayed.

Press the back arrow to return to category selection.

#### Step 4: Preview Style

A full-screen preview of the selected style's reference image is displayed with the heading "CONFIRM STYLE?" and a **CONFIRM** button (with a checkmark icon) in the top-right corner.

The image supports zoom and pan (mouse wheel/pinch to zoom 1x-2.5x, drag to pan when zoomed).

Press the back arrow to return to style selection, or press **CONFIRM** to proceed.

#### Step 5: Take Photo

The live camera feed is displayed with the heading "LOOK AT THE CAMERA!" and a **TAKE PHOTO** button (with a camera icon) in the top-right corner.

The camera uses saved settings for device selection, brightness, contrast, and white balance (configured in Settings).

Pressing **TAKE PHOTO** triggers:
1. A **3-second countdown** (3... 2... 1...) displayed over the camera feed.
2. A **flash strobe effect** at the moment of capture.
3. The photo is captured from the canvas (with camera filters applied and the image mirrored horizontally).
4. Navigation to the review screen.

During the countdown, the TAKE PHOTO button and back arrow are temporarily disabled.

#### Step 6: Review Photo

The captured photo is displayed with the heading "CONFIRM PHOTO?" and a **CONFIRM** button.

- Press **CONFIRM** to proceed with AI generation.
- Press the back arrow to retake the photo.

#### Step 7: AI Generation (Loading)

After confirming, the generation process begins:

- A progress bar and percentage indicator are displayed (title: "LOADING...").
- The progress bar animates smoothly from 0% to 95% over approximately 90 seconds.
- The application polls the backend every second for the generation status.

**Email/ID Collection (at ~15 seconds):** An email input modal automatically appears with a virtual keyboard, titled "ENTER EMAIL OR ID". The guest can type their email address and press **CONFIRM**. If the generation is already complete when the email is submitted, the email with the photo link is sent immediately. Otherwise, it is queued and sent when generation completes. The minimum input length is 6 characters.

**High Demand Message (at ~40 seconds):** If generation takes longer than 40 seconds, the message "HIGH DEMAND -- YOUR IMAGE IS BEING PROCESSED" is displayed below the progress bar.

**Generation Completion:** When the server returns a successful result:
1. The progress bar jumps to 100%.
2. The generated image is saved locally with the active frame overlay composited on top (if any frame is enabled).
3. The final image is uploaded to cloud storage (R2) so the QR code and email link serve the framed version.
4. A QR code is generated pointing to the photo's public web page.
5. The email modal closes automatically.
6. The result view is displayed.

**Generation Failure:** If generation fails, an error message is shown, the email modal closes, and the user is returned to the start screen.

#### Step 8: Result

The final AI-generated image is displayed with the heading "HERE'S YOUR IMAGE!" A QR code overlay appears in the corner of the image, which the guest can scan to download or share their photo.

The result image supports zoom and pan.

**Printing:** If printing is enabled in Settings, a **PRINT** button (with a printer icon) appears in the top-right corner. Pressing it opens the print modal:
- "HOW MANY PRINTS?" with minus (-) and plus (+) buttons and a counter display.
- Press **CONFIRM** to send the print job, or **CANCEL** to dismiss.
- The print job is sent silently to the configured printer.

If **automatic printing** is enabled in Settings, the print job is sent automatically without user interaction, and the manual PRINT button is hidden.

If printing is **disabled** in Settings, the PRINT button is hidden.

**Finishing the cycle:** Press the home icon button in the top-left corner to return to the "TOUCH TO START..." screen for the next guest.

### PIN Security in Event Mode

If a Security PIN is configured (see [Settings](#security-pin)):

- Pressing **EXIT** in Event Mode requires entering the correct 4-digit PIN.
- The PIN keypad auto-closes after 5 seconds of inactivity.
- If the wrong PIN is entered, the modal simply closes without navigating.

---

## 7. Prompt Lab

The Prompt Lab is where you create and manage the AI style prompts used in Event Mode. Prompts are organized into categories, and each prompt consists of a name, description text, and a reference/thumbnail image.

### Library View

The main Prompt Lab view shows a grid of all prompt categories. Each category card displays up to 4 thumbnail images from its prompts and the category name. Two action buttons appear in the top-right corner:

| Button | Icon | Action |
|--------|------|--------|
| **UPDATE PROMPTS** | Cloud download | Downloads and merges prompts from the KRUDER 1 cloud server |
| **IMPORT / EXPORT ALL** | Right-left arrows | Opens the import/export dialog |

Press the back arrow to return to the Dashboard.

### Category Details View

Tapping a category card opens it, showing a grid of all prompts in that category. The category name is displayed as the title with a pen icon for renaming.

Each prompt card shows the prompt's thumbnail image and name. A toggle switch allows enabling/disabling individual prompts (disabled prompts are not shown in Event Mode).

At the bottom of the grid, a **GENERATE PROMPT** button (with a plus icon) allows creating new prompts with AI generation, and a **MANUAL PROMPT** button allows adding prompts without AI.

### Creating a Prompt with AI Generation

1. From a category details view, press **GENERATE PROMPT**.
2. The Generate Prompt view appears with these fields:
   - **PROMPT NAME**: A text input for the prompt's display name.
   - **Category selector**: A dropdown to choose an existing category or select "+ CREATE NEW CATEGORY" to create a new one.
   - **NEW CATEGORY NAME**: Appears when "CREATE NEW CATEGORY" is selected.
   - **PROMPT DESCRIPTION**: A textarea for the AI prompt text that describes the desired style.
   - **Reference image area**: Press "PRESS TO SELECT REFERENCE IMAGE" to upload a reference photo from your computer.
   - **Result image area**: Shows the AI-generated result after generation.
3. Press **GENERATE (1 CREDIT)** to send the reference image and prompt description to the AI engine.
4. One credit is consumed. The resulting image becomes the prompt's thumbnail.
5. The prompt is saved to the selected (or newly created) category.

### Creating a Manual Prompt

Manual prompts allow you to add prompts with your own image without using AI generation (no credits consumed):

1. From the category details view, press the manual prompt option.
2. Fill in the prompt name, select or create a category, provide a description, and upload an image.
3. The prompt is saved immediately.

### Viewing and Editing a Prompt

Tapping a prompt card opens the prompt detail view, showing:

- The prompt name (with pen icon for renaming)
- The prompt description text (read-only, with a copy button)
- The prompt's reference/thumbnail image (click to view full-screen with zoom)

### Renaming a Category

1. In the Category Details view, press the **pen icon** next to the category name.
2. A "RENAME CATEGORY" modal appears with a virtual keyboard.
3. Edit the name and press **CONFIRM**.

### Renaming a Prompt

1. In the prompt detail view, press the **pen icon** next to the prompt name.
2. A "RENAME PROMPT" modal appears with a virtual keyboard.
3. Edit the name and press **CONFIRM**.

### Deleting a Category

Categories can be deleted by pressing the delete option, which shows a confirmation dialog: "DELETE THIS CATEGORY AND ALL ITS PROMPTS? THIS ACTION IS IRREVERSIBLE." All prompts within the category and their associated images are permanently removed.

### Deleting a Prompt

Individual prompts can be deleted through the prompt detail view or by dragging the prompt card to the trash icon. A confirmation dialog is displayed: "DELETE THIS PROMPT? THIS ACTION IS IRREVERSIBLE."

### Drag and Drop

Prompts support drag-and-drop for:

- **Reordering**: Drag prompt cards within a category to change their display order.
- **Moving to another category**: Drag a prompt card to a different category (shown as targets during drag).
- **Creating a new category**: Drag a prompt card to the plus (+) icon to create a new category and move the prompt into it.
- **Deleting**: Drag a prompt card to the trash icon.

Categories also support drag-and-drop reordering in the main Library view.

### Enabling/Disabling Prompts and Categories

Each prompt and category has a toggle switch:

- **Disabled prompts** are not displayed during Event Mode style selection.
- **Disabled categories** are not displayed during Event Mode category selection.

Toggle switches persist across sessions.

### Updating Prompts from Cloud

Pressing **UPDATE PROMPTS** downloads the latest prompt library from the KRUDER 1 server and merges it with your local library:

- New categories and prompts are added.
- Existing categories and prompts (matched by name) are not duplicated.
- Your custom local prompts are preserved.

### Import / Export Prompts

The **IMPORT / EXPORT ALL** button opens a dialog with two options:

- **IMPORT**: Select a `.kruder1` file to import prompts. Prompts are merged with the existing library (duplicates by name within the same category are skipped).
- **EXPORT**: Save all prompts and their images as a `.kruder1` file (ZIP archive containing `data.json` and `images/` folder).

---

## 8. Frames

Frames are PNG overlay images that are composited on top of every AI-generated image. They are useful for adding branding, decorative borders, or event-specific graphics.

### How Frames Work

- Frames must be **PNG files with transparency** (alpha channel). The transparent areas reveal the generated image beneath.
- Only **one frame can be active at a time** (exclusive toggle). Activating one frame automatically deactivates all others.
- When a frame is active, it is resized to match the generated image dimensions and alpha-composited on top using PIL.
- The framed image is what gets uploaded to the cloud, so guests receive the framed version via QR code and email.

### Frames Grid View

The Frames module shows a grid of all uploaded frames. Each frame card displays:

- A toggle switch to **enable/disable** the frame
- A preview showing the frame overlaid on a test background image
- The frame name (derived from the original filename, converted to uppercase)

Active frames have a highlighted preview border.

The **ADD FRAME** button (with a plus icon) is always displayed at the top of the grid.

### Adding a Frame

1. Press **ADD FRAME**.
2. A file picker dialog opens. Select a **PNG file** from your computer.
3. The frame is copied to the application's frames storage and added to the grid.
4. Newly added frames are **disabled by default** -- you must toggle them on to activate.

Only PNG files are accepted. Attempting to add a non-PNG file will display an error: "ONLY PNG FILES ARE ALLOWED."

### Previewing a Frame

Click any frame card (not on the toggle switch) to open a full-screen preview. The preview shows the frame overlay on top of a test background image (if the frame is active) or just the frame image alone.

Press the back arrow to return to the frames grid.

### Deleting a Frame

Frames can be deleted by drag-and-drop:

1. Press and hold a frame card.
2. Drag it toward the trash icon that appears at the bottom of the screen.
3. Drop the card on the trash icon.
4. A confirmation dialog appears: "DELETE THIS FRAME?"
5. Press **CONFIRM** to delete or **CANCEL** to abort.

Deleted frame images are sent to the Windows Recycle Bin.

### Activating/Deactivating a Frame

Use the toggle switch on each frame card:

- **Turning a frame ON** automatically turns off any previously active frame (exclusive toggle).
- **Turning a frame OFF** deactivates it, leaving no frame active.

When no frame is active, generated images are saved without any overlay.

---

## 9. Settings

The Settings module provides configuration options for camera, printing, sound, language, interface appearance, security, and software updates.

### Settings Menu

The main Settings view displays a grid of buttons:

| Button | Icon | Action |
|--------|------|--------|
| **CAMERA** | Camera | Opens camera configuration |
| **PRINTING** | Printer | Opens printing configuration |
| **SOUND** | Speaker | Opens sound volume settings |
| **LANGUAGE** | Globe | Opens language selection |
| **INTERFACE** | Palette | Opens interface appearance settings |
| **FULLSCREEN** | Expand | Toggles fullscreen mode |
| **SECURITY PIN** | Key | Opens PIN configuration |
| **UPDATE** | Download | Opens software update screen |

The current application version is displayed at the bottom of the Settings view (e.g., "v1.0.0").

### Camera Settings

The Camera settings view allows you to:

1. **Select a camera** from a dropdown list of available video devices.
2. **View a live camera preview** with filters applied in real-time.
3. **Adjust image parameters** using sliders (range 0-100, neutral at 50):
   - **BRIGHTNESS**: Adjusts overall image brightness.
   - **CONTRAST**: Adjusts image contrast.
   - **WHITE BALANCE**: Shifts color temperature (warmer/cooler).
4. **RESET SETTINGS**: Returns brightness, contrast, and white balance to their default values (50).

Camera settings are saved automatically when you navigate away and are used during Event Mode photo capture.

### Printing Settings

The Printing settings view provides:

- **Test image preview**: Shows the test print image that will be used for test printing.
- **Printing enabled/disabled toggle**: A switch labeled "DISABLED" or "ENABLED" to control whether printing functionality is available. When disabled, the PRINT button does not appear in Event Mode.
- **AUTOMATIC PRINTING toggle**: When enabled, images are automatically sent to the printer upon generation completion in Event Mode (the manual PRINT button is hidden).
- **NUMBER OF COPIES**: Plus (+) and minus (-) buttons to set the default number of copies for automatic printing (minimum 1, maximum 999).
- **Printer selector**: A dropdown listing all available Windows printers (detected via win32print or PowerShell fallback).
- **PRINTER SETTINGS**: Opens the Windows printer preferences dialog for the selected printer.
- **TEST PRINTING**: Sends a test page to the selected printer for verification.

All printing settings are auto-saved as you make changes.

### Sound Settings

The Sound settings view has two volume sliders:

- **BACKGROUND SOUND** (default: 15%): Controls the volume of the ambient background loop that plays during the application's operation.
- **UI SOUND** (default: 75%): Controls the volume of button clicks, keyboard sounds, PIN pad tones, toggle sounds, lock/unlock sounds, and warning sounds.

Both sliders range from 0% (silent) to 100% (maximum volume). Changes are saved when you navigate away from the Sound view.

### Language Settings

The Language settings view allows you to select the application's display language. KRUDER 1 supports 10 languages:

| Code | Language |
|------|----------|
| en | English |
| es | Espanol |
| fr | Francais |
| de | Deutsch |
| it | Italiano |
| pt | Portugues |
| ja | Japanese |
| zh | Chinese |
| ru | Russian |
| ar | Arabic |

Select a language from the dropdown and press **APPLY**. All interface text, button labels, and modal messages will update to the selected language.

### Interface Settings

The Interface settings view provides fine-grained control over the application's visual appearance:

- **ACCENT COLOR** (Hue slider, 0-360 degrees): Controls the accent color used for primary buttons, progress bars, and highlights. The color is rendered as an HSL hue with fixed saturation and lightness.
- **BACKGROUND LUMINANCE** (0-100%): Controls the background brightness. Values below 50% produce a light theme; values at or above 50% produce a dark theme.
- **TEXT / ICONS** (0-100%): Controls the luminance of text and icon elements.
- **LIGHT MODE** button: Resets to a light theme preset.
- **DARK MODE** button: Resets to a dark theme preset.

Changes are applied in real-time and saved when you navigate away.

### Fullscreen

Pressing **FULLSCREEN** toggles the application window between fullscreen and windowed mode. This is useful for kiosk deployments where the application should fill the entire screen.

### Security PIN

The Security PIN feature adds a 4-digit PIN lock to protect critical actions:

**When a PIN is configured, it is required to:**
- Exit Event Mode (pressing the EXIT button)
- Unlock the Dashboard lock screen
- View the full event gallery ("SHOW ALL GALLERY" option)

**Setting up a PIN:**

1. Navigate to Settings and press **SECURITY PIN**.
2. If no PIN is set, the status shows "PIN NOT CONFIGURED" and the instruction reads "ENTER NEW PIN".
3. Enter a 4-digit PIN using the on-screen number pad.
4. The instruction changes to "CONFIRM PIN". Re-enter the same 4-digit PIN.
5. If both entries match, the PIN is saved and the view shows "PIN CONFIGURED" with a **RELEASE PIN** button.
6. If the entries do not match, the message "PINS DO NOT MATCH" is displayed, and you can try again.

**Releasing (removing) a PIN:**

1. Press **RELEASE PIN**.
2. An "ENTER CURRENT PIN" keypad appears.
3. Enter the current 4-digit PIN to confirm removal.
4. If correct, the PIN is removed and the setup view is shown again.

**PIN storage:** PINs are stored in the browser's session storage (`KRUDER1-pin`) and persist only for the current application session. If the application is restarted, the PIN must be set again.

**Lock screen text customization:**

Below the PIN configuration, there is an **EDIT LOCK SCREEN TEXT** button. Pressing it opens a virtual keyboard modal where you can customize the message shown on the Dashboard lock screen (default: "We'll be back in a few minutes...").

### Software Update

The Software Update view allows you to check for and install application updates:

1. Press **UPDATE** in the Settings menu.
2. The current version is displayed (e.g., "v1.0.0").
3. Press **CHECK FOR UPDATES**.
4. The application queries the server for the latest available version.

**If up to date:** A checkmark and "You're up to date" message are displayed.

**If an update is available:**
1. The new version number, release notes, and download size are shown.
2. Press **DOWNLOAD** to begin downloading the installer.
3. A progress bar shows download progress with percentage and MB indicators.
4. After download completes, the downloaded file's SHA-256 hash is verified against the server-provided hash.
5. If verification passes, press **INSTALL & RESTART** to launch the installer. The application closes to allow the update to proceed.
6. If hash verification fails, an error is displayed and the downloaded file is deleted.

**On error:** An error message is shown with a **RETRY** button.

The installer is downloaded to your `~/Downloads` folder.

---

## 10. Credit System

KRUDER 1 uses a credit-based model for AI image generation. Each AI generation (whether in Event Mode or Prompt Lab) consumes **1 credit**.

### Credit Packages

Credits are purchased through the Stripe payment system. Three packages are available:

| Package | Credits | Price |
|---------|---------|-------|
| Basic | 150 | $40 |
| Plus | 300 | $60 |
| Pro | 600 | $90 |

### Demo Credits

New users can claim **10 free demo credits** to try the software. Demo credits:

- Are available **once per hardware device** (identified by HWID).
- Are claimed through the website, not through the desktop application.
- Work identically to purchased credits.

### Checking Your Balance

Your current credit balance is visible in the **Account** panel on the Dashboard. The credit count is displayed alongside a **REFRESH** button that syncs your balance with the server.

Credits are also updated automatically after each successful generation -- the remaining balance is returned by the server and updated in the local session.

### Purchasing Credits

Credit purchases are made through the KRUDER 1 website via Stripe checkout. After a successful payment, the purchased credits are added to your account and become available immediately upon refreshing your account data in the application.

---

## 11. Statistics

The Statistics view provides detailed metrics about your usage of KRUDER 1, broken down into Event Mode statistics and Prompt Lab statistics.

### Accessing Statistics

Press **STATISTICS** on the Dashboard, or navigate to Settings and access the Statistics view.

### Event Scope Selector

A dropdown at the top allows you to view statistics for:

- **GLOBAL**: Aggregated across all events
- **Individual events**: Select a specific event from the dropdown to see its statistics

The title updates to show either "GLOBAL STATISTICS" or "[Event Name] STATISTICS".

### Event Mode Statistics

The following metrics are tracked:

**Photos**

| Metric | Description |
|--------|-------------|
| Generations | Total number of generation attempts |
| Successful | Number of generations that completed successfully |
| Failed | Number of generations that failed |
| Success Rate | Percentage of successful generations |

**Printing**

| Metric | Description |
|--------|-------------|
| Sent | Total number of print jobs sent |
| Successful | Number of print jobs that completed successfully |
| Failed | Number of print jobs that failed |
| Success Rate | Percentage of successful print jobs |

**Additional Metrics**

| Metric | Description |
|--------|-------------|
| Average Generation Time | Mean time for successful generations (in seconds) |
| Emails Collected | Number of unique valid email addresses collected from guests |

### Export Emails

The **EXPORT EMAILS** button at the bottom of the Event Mode statistics section allows you to export all collected email addresses. The export respects the current event scope (global or specific event) and includes only valid, unique email addresses.

### Prompt Lab Statistics

| Metric | Description |
|--------|-------------|
| Generations | Total Prompt Lab generation attempts |
| Successful | Number of successful Prompt Lab generations |
| Failed | Number of failed Prompt Lab generations |
| Success Rate | Percentage of successful Prompt Lab generations |
| Average Generation Time | Mean time for successful Prompt Lab generations |

---

## 12. Troubleshooting

### Debug Log Upload (Easter Egg)

If you experience issues and need to send diagnostic information to the KRUDER 1 support team:

1. **Tap the KRUDER 1 logo 5 times in rapid succession** (within 2 seconds).
2. The application uploads the current debug log file to the server.
3. A confirmation message appears: "Debug log sent. Thank you."
4. If the upload fails, the message "Could not send log. Try again later." is displayed.

This feature works from any screen except Event Mode.

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "FILL ALL FIELDS" | Login attempted with empty email or password | Enter both email and password before pressing LOG IN |
| "CONNECTION ERROR" | Cannot reach the authentication server | Check your internet connection and try again |
| "CAMERA ERROR: Access denied" | Browser/system denied camera access | Grant camera permission in system settings, or check that the camera is not in use by another application |
| "NO SESSION -- PLEASE LOG IN" | Session has expired or been cleared | Log out and log back in |
| "NO EVENT STARTED" | Attempted generation without an active event | Ensure you started Event Mode from an event in the Event Manager |
| "GENERATION FAILED, TRY AGAIN" | AI generation service returned an error | Try again; if persistent, check your credit balance and internet connection |
| "Could not upload photo. Please try again." | Failed to upload the framed result to cloud storage after 3 retry attempts | Check your internet connection and try again |
| "ONLY PNG FILES ARE ALLOWED" | Attempted to add a non-PNG file as a frame | Use a PNG file with transparency for frame overlays |
| "WRONG PASSWORD" | Incorrect password during logout verification | Re-enter the correct account password |
| "SELECT A PRINTER FIRST" | Attempted test print or printer settings without selecting a printer | Choose a printer from the dropdown in Printing settings |
| "COULD NOT DOWNLOAD PROMPTS" | Prompt update from cloud server failed | Check your internet connection and try again |

### Camera Issues

- **No cameras listed in Settings:** Ensure your camera is plugged in and recognized by Windows. Try a different USB port. Check Windows Device Manager for driver issues.
- **Camera shows black screen:** The camera may be in use by another application. Close other programs that might be using the camera (video conferencing apps, other camera software).
- **Image too dark/bright in Event Mode:** Adjust the brightness, contrast, and white balance sliders in Settings > Camera. Use the live preview to verify your adjustments. Press RESET SETTINGS to return to defaults (50/50/50).
- **Camera feed appears mirrored:** This is by design. The camera preview in Event Mode uses canvas rendering, and captured photos are automatically mirrored horizontally to produce a natural-looking result.

### Printer Issues

- **No printers listed in Settings:** Ensure your printer is installed and visible in Windows Settings > Printers & Scanners. The application detects printers via win32print or PowerShell.
- **Test print fails:** Verify the printer is online and has paper/ink. Try printing a test page from Windows directly. Ensure the `pywin32` package is installed if running from source.
- **Automatic printing not working:** Confirm that (1) printing is enabled (toggle ON), (2) automatic printing is enabled (toggle ON), (3) a printer is selected from the dropdown, and (4) the number of copies is at least 1.
- **PRINT button not visible in Event Mode:** This is expected behavior when either printing is disabled or automatic printing is enabled. In automatic mode, printing happens without user interaction.

### Network Issues

- **Account data not refreshing:** Press the **REFRESH** button in the Account panel. Ensure you have an active internet connection.
- **Generation takes very long:** AI generation typically completes within 30-60 seconds. If it exceeds this, the "HIGH DEMAND" message will appear. In rare cases of server overload, generation may take up to 90 seconds. If it fails, try again.

### Data and Storage

- **Application data location:** All local data is stored in `%APPDATA%\Kruder1\`. This includes session files, prompt databases, frame images, event data, and log files.
- **Log files:** Logs are stored with daily rotation and 30-day retention. Sensitive data (tokens, passwords) is automatically redacted from logs.
- **Recovering deleted events/images:** Deleted events and images are sent to the Windows Recycle Bin and can be restored from there before the bin is emptied.

---

*KRUDER 1 -- AI Photo Booth Software*
*www.kruder1.com*
