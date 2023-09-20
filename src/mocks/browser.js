// src/mocks/browser.js

import * as browser from "msw/browser";

import { handlers } from "./handlers";

// This configures a Service Worker with the given request handlers.

export const worker = browser.setupWorker(...handlers);
