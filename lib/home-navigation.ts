export const HOME_SETTINGS_ROUTE = "/settings" as const;

export function getHomeSettingsRoute(): typeof HOME_SETTINGS_ROUTE {
  return HOME_SETTINGS_ROUTE;
}
