# Release Notification

This context tracks subscriptions to GitHub releases and communicates eligible
releases to the Digital Hub audience.

## Language

**Subscription**:
A monitored GitHub repository whose eligible releases may be communicated.
_Avoid_: Watch, feed

**Eligible release**:
A repository release that is neither a draft nor excluded by the configured
pre-release policy.
_Avoid_: Latest release, update

**Latest-only delivery**:
The release policy that communicates only the newest eligible release for a
subscription; a newer release supersedes an undelivered older one.
_Avoid_: Release backlog, historical catch-up

**Release delivery**:
One Telegram message that communicates an eligible release to its intended
audience, either the channel or the administrator's private chat.
_Avoid_: Notification, post, push

**Silent delivery**:
A release delivery that reaches its audience without triggering a Telegram
sound notification.
_Avoid_: Alert, audible notification

**Release preview**:
A release delivery sent to the administrator after a subscription is added; it
does not also appear in the channel for that same release.
_Avoid_: Backfill, initial notification

**Pending delivery**:
A release delivery whose detail page has been prepared but whose Telegram
message has not yet been sent successfully.
_Avoid_: Failed notification, queued post

**Best-effort de-duplication**:
The delivery policy that prevents duplicate release deliveries during ordinary
retries, while accepting that rare concurrent or interrupted processing can
produce a duplicate.
_Avoid_: Exactly-once delivery, guaranteed de-duplication

**Degraded delivery**:
A release delivery that omits the release detail page but still communicates
the release through Telegram when page publication is unavailable.
_Avoid_: Failed delivery, partial notification

**Release detail page**:
A public Telegraph page linked from a release delivery that provides the
release's extended detail.
_Avoid_: Telegraph post, article, TPH page

**Retained detail page**:
A release detail page that remains publicly accessible after its subscription
ends; it is historical publication, not subscription state.
_Avoid_: Orphaned page, stale page

**Published detail page**:
A release detail page whose content is owned by a human editor after creation;
the bot may link to it but does not change it.
_Avoid_: Managed article, synchronised page

**Public detail page**:
A release detail page intended for public access; subscriptions are treated as
sources of public release information.
_Avoid_: Private article, restricted page
