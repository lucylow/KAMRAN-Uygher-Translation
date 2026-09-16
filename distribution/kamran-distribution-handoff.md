# KAMRAN Distribution Handoff

## Durable Manus URL

The reserved public Manus URL for KAMRAN is:

<https://kamranai-7fmtndgw.manus.space>

At handoff time, this domain returned a Manus maintenance response (`HTTP 503`) rather than the app. Click **Publish** in the project Management UI to make the checkpoint available at this domain. Publishing was not initiated from the sandbox.

## QR Artifact

`kamran-manus-link-qr.png` encodes the durable Manus URL above. It is a web-link QR, not an Expo Go development QR. The payload stays stable if the Manus deployment continues using the same domain.

## Expo Distribution Note

An `expo start` QR code is a development-session address and cannot be permanent: it depends on a running Metro server and its network address. For a permanent iOS distribution path, create an EAS production build and distribute through TestFlight/App Store Connect. A permanent QR should then encode the public App Store/TestFlight landing page or a stable release landing page, rather than an `exp://` development URI.
