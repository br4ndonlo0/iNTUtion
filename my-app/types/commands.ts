// Voice and Gesture Command Types

export type GestureType = 
  | 'Thumb_Up'      // Confirm / Yes
  | 'Thumb_Down'    // Reject / No
  | 'Open_Palm'     // Stop / Back
  | 'Closed_Fist'   // Drag / Grip
  | 'Pointing_Up'   // Scroll Up / Select
  | 'Victory'       // Toggle Mode
  | 'ILoveYou'      // Easter Eggs
  | 'None';         // No gesture

export type VoiceCommand =
  | 'name'       // Next input fills full name field
  | 'username'   // Next input fills username field
  | 'email'      // Next input fills email field
  | 'phone'      // Next input fills phone field
  | 'password'   // Next input fills password field
  | 'confirm'    // Next input fills confirm password field
  | 'home'       // Navigate to home
  | 'account'    // Navigate to account
  | 'settings'   // Navigate to settings
  | 'transfer'   // Navigate to transfer or set amount
  | 'search'     // Search for account to transfer to
  | 'navigate'   // Listen for navigation target
  | 'history'    // Navigate to history
  | 'yes'        // Confirm action
  | 'no';        // Reject action

export type InputMode = 'idle' | 'listening_for_field' | 'listening_for_value';

export interface VoiceState {
  mode: InputMode;
  targetField: 'name' | 'username' | 'email' | 'phone' | 'password' | 'confirm' | 'search' | 'amount' | 'navigate' | null;
  lastCommand: VoiceCommand | null;
  isListening: boolean;
  transcript: string;
}

export interface CommandContext {
  currentPath: string;
  isAuthPage: boolean; // /login or /register
  isTransferPage: boolean; // /transfer
  isTransferDetailPage: boolean; // /transfer/[id]
}
