# EcoSphere HCI Project Documentation

## 1. Project Overview
**EcoSphere** is a sustainable e-commerce landing page designed with a focus on **Human-Computer Interaction (HCI)** principles. The goal is to provide a seamless experience across multiple interaction modes while adhering to accessibility standards.

## 2. Mandatory Interaction Modes
### 1. Keyboard Interaction
- **Tab Navigation**: All interactive elements (`a`, `button`, `input`) have clear focus states and logical tab order.
- **Keyboard Shortcuts**:
    - `Alt + H`: Navigate to Home
    - `Alt + S`: Navigate to Shop
    - `Alt + C`: Open/Close Shopping Cart
- **Form Submission**: The contact form can be submitted by pressing `Enter` while inside any input field.

### 2. Mouse Interaction
- **Click Events**: Smooth modal transitions for the cart and scroll transitions for navigation.
- **Hover Effects**: All buttons and product cards have transform effects and color shifts to indicate interactivity.

### 3. Touch Interaction
- **Mobile Responsive**: The layout adjusts for smaller screens using CSS Flexbox and Grid.
- **Touch-Friendly**: All buttons and links meet the minimum recommended tap target size (48px x 48px).

### 4. Voice Interaction
- **Technology**: Built using the **Web Speech API**.
- **Commands**:
    - "Open Home" / "Go to Home"
    - "Open Shop"
    - "Open Cart"
    - "Submit Form" / "Submit"

### 5. Visual / Graphical Interaction
- **Icons**: Used FontAwesome icons for cognitive support (e.g., cart, products, microphone).
- **Feedback**: **Toast Notifications** appear for every major action (Adding to cart, removing, form submission).
- **Animations**: Smooth CSS transitions for hover, modal opening, and voice mode activation (pulsing indicator).

### 6. Interaction & Navigation
- **AI Hand Gesture Recognition**: This is an advanced HCI feature using **Computer Vision (MediaPipe & Fingerpose)**.
    - **Victory Sign (✌️)**: Navigates to **Home**.
    - **Thumbs Up (👍)**: Navigates to **Shop**.
    - **Open Palm (🖐️)**: Navigates to **Contact**.
- **Gesture Interaction**: Added **Swipe Gestures** for mobile users. Swiping left moves you to the next section, and swiping right moves you back.
- **Glassmorphism & Minimalism**: The design has been refined to be **simpler and more elegant**, using subtle mesh gradients, clear typography, and a "less is more" aesthetic while maintaining premium interactivity.
- **Improved Imagery**: All products now feature hand-picked, high-quality images that load instantly and provide a professional shopping experience.

## 4. Shneiderman’s 8 Golden Rules
1. **Strive for Consistency**: Used a unified color palette (Emerald Green & Slate) and consistent button geometry.
2. **Enable Frequent Users to Use Shortcuts**: Implemented `Alt + Key` shortcuts.
3. **Offer Informative Feedback**: Every interaction (cart add/remove) triggers a visual toast message.
4. **Design Dialogs to Yield Closure**: Form submission shows a "Success" message to signify the end of the transaction.
5. **Offer Error Prevention/Simple Error Handling**: Real-time form validation prevents submission of invalid data (e.g., short names, invalid emails).
6. **Permit Easy Reversal of Actions**: The cart includes an **"Undo"** feature after removing an item.
7. **Support Internal Locus of Control**: Users can always exit modals via the `Esc` key, "X" button, or outside click.
8. **Reduce Short-term Memory Load**: A persistent cart icon shows the current item count, so users don't have to remember what they've added.
