# KAMRAN Physical-iPhone and TestFlight Matrix

Use a production-like EAS preview or TestFlight build on at least one current iPhone and one older supported iPhone. Record iOS version, device model, build number, permissions, and pass/fail evidence for every row.

| Area             | Test                                                                                    | Expected result                                                                          |
| ---------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Launch           | Cold launch after install                                                               | App opens without a blank screen, crash, or development URL requirement.                 |
| Onboarding       | Continue through all slides and use Skip                                                | Completion persists after relaunch and the tab experience opens.                         |
| Translation      | Translate Uyghur to Chinese and Chinese to Uyghur                                       | Loading, result, reset, and accessibility feedback complete without stale results.       |
| Voice permission | Deny microphone access, then retry after enabling it in Settings                        | The app explains the state and recovers without a dead end.                              |
| Voice lifecycle  | Start, stop, rerecord, review, play, pause, and replay                                  | State labels remain synchronized and repeated taps do not create stale playback.         |
| OCR permission   | Open OCR, deny unavailable native access, and recover                                   | Review guidance remains clear and reset does not lose the selected source unnecessarily. |
| History          | Save, favorite, search, filter, delete, and relaunch                                    | Local history and favorites remain correct after relaunch.                               |
| Learn            | Open a cultural card, complete it, reset progress, and relaunch                         | Completion and reset affect only cultural progress.                                      |
| Accessibility    | VoiceOver, Larger Text, Reduce Motion, Dark Mode, and Differentiate Without Color Alone | Controls remain labeled, content remains legible, and motion is reduced when requested.  |
| Resilience       | Airplane Mode and interrupted app lifecycle                                             | Local MVP flows remain usable and errors provide recovery actions.                       |
| Store review     | Follow the App Review notes exactly                                                     | Every documented path is reachable without credentials or private setup.                 |

Before submission, replace any assumptions in the metadata, privacy policy, and review notes with the exact production behavior of the submitted build.
