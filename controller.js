import { openOverlay, closeOverlay } from './index';

let isOpen = false;

function toggleBlurOverlay() {
  if (isOpen) {
    isOpen = false;
    closeOverlay();
  } else {
    isOpen = true;
    openOverlay();
  }
}

function setOpenState(openState) {
  isOpen = openState;
  openState ? openOverlay() : closeOverlay();
}

export default {
  toggleBlurOverlay,
  setOpenState,
}