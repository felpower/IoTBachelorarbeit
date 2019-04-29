import { Component } from '@angular/core';

export const PREFIX = '--';

export class ColorUtil {

  constructor() {
  }

  // Read the custom property of body section with given name:
  getColor(name: string): string {
    let bodyStyles = window.getComputedStyle(document.body);
    return bodyStyles.getPropertyValue(PREFIX + name);
  }
}
