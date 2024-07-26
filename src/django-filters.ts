/*
 * django-filters.js is a JavaScript implementation of Django's template filters.
 * Copyright (c) 2020 Dan Ryan. Available under the MIT License.
 */

import { default as djangoFilters } from "./index";

declare global {
  interface Window {
    djangoFilters: typeof djangoFilters;
  }
}

window.djangoFilters = djangoFilters;
