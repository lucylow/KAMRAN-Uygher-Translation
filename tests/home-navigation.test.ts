import { describe, expect, it } from "vitest";

import {
  HOME_SETTINGS_ROUTE,
  getHomeSettingsRoute,
} from "../lib/home-navigation";

describe("home navigation", () => {
  it("opens the real Settings screen from the Home shortcut", () => {
    expect(getHomeSettingsRoute()).toBe(HOME_SETTINGS_ROUTE);
    expect(getHomeSettingsRoute()).toBe("/settings");
  });
});
